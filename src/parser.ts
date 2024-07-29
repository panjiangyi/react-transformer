/* eslint-disable eqeqeq */
import { parse } from "@babel/parser";
import traverse, { NodePath, VisitNode } from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";
import template from "@babel/template";

// 创建一个新的父JSXElement节点
const createParentJsxElement = (
  childNode: t.JSXElement,
  indentation?: t.Node
) => {
  let tmp = t.jsxText("\n  ");
  if (t.isJSXText(indentation)) {
    tmp = indentation;
  }
  return t.jsxElement(
    t.jsxOpeningElement(t.jsxIdentifier("div"), []),
    t.jsxClosingElement(t.jsxIdentifier("div")),
    [tmp, childNode, tmp],
    false
  );
};

export const createStart =
  (implementation: (path: NodePath<t.JSXElement>) => unknown) =>
  (sourcecode: string, start: number) => {
    const ast = parse(sourcecode, { plugins: ["jsx"] });
    traverse(ast, {
      JSXElement(path) {
        const _start = path.node.openingElement.start ?? Infinity;
        const _end = path.node.openingElement.end ?? -Infinity;
        if (start < _start || start > _end) {
          return;
        }
        return implementation(path);
      },
    });
    const { code } = generate(ast, {
      jsescOption: {
        minimal: false,
      },
      compact: false, // 不压缩输出
      minified: false, // 不生成最小化代码
      concise: false, // 不省略不必要的空格和行
      retainLines: true, // 保留原始代码中的行号
    });
    return code;
  };

export const wrapWithDiv = createStart((path) => {
  let IndentationJSXText = path.getSibling((path.key as number) - 1).node;

  const parentJsxElement = createParentJsxElement(
    path.node,
    IndentationJSXText
  );
  path.replaceWith(parentJsxElement);
  path.skip();
});

const findNextJsxElementSibling = (path: NodePath) => {
  let siblingPath = path.getSibling((path.key as number) + 1);
  while (siblingPath.node && !t.isJSXElement(siblingPath.node)) {
    siblingPath = siblingPath.getSibling((siblingPath.key as number) + 1);
  }
  return siblingPath;
};
export const SwapWithSibling = createStart((path) => {
  const nextSiblingPath = findNextJsxElementSibling(path);

  if (!nextSiblingPath.isJSXElement()) {
    return;
  }
  const currentNode = t.cloneNode(path.node);
  const nextNode = t.cloneNode(nextSiblingPath.node);

  // 替换当前节点为下一个兄弟节点
  path.replaceWith(nextNode);

  // 替换下一个兄弟节点为当前节点
  nextSiblingPath.replaceWith(currentNode);
  nextSiblingPath.skip();
  path.skip();
});

export const swapParentChild = createStart((path: NodePath) => {
  const parentPath = path.parentPath;
  if (parentPath == null) {
    return;
  }

  // 确保父节点和子节点都是JSXElement
  if (t.isJSXElement(parentPath.node) && t.isJSXElement(path.node)) {
    const parentTagName = parentPath.node.openingElement.name;
    const childTagName = path.node.openingElement.name;

    parentPath.node.openingElement.name = childTagName;
    if (parentPath.node.closingElement) {
      parentPath.node.closingElement.name = childTagName;
    }

    path.node.openingElement.name = parentTagName;
    if (path.node.closingElement) {
      path.node.closingElement.name = parentTagName;
    }

    // 交换属性
    const parentAttributes = parentPath.node.openingElement.attributes;
    const childAttributes = path.node.openingElement.attributes;

    parentPath.node.openingElement.attributes = childAttributes;
    path.node.openingElement.attributes = parentAttributes;
  }
});
