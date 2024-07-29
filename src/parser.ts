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
