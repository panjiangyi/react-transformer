/* eslint-disable eqeqeq */
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";
import template from "@babel/template";

// 创建一个新的父JSXElement节点
const createParentJsxElement = (childNode: t.JSXElement) => {
  return t.jsxElement(
    t.jsxOpeningElement(t.jsxIdentifier("section"), []),
    t.jsxClosingElement(t.jsxIdentifier("section")),
    [childNode],
    false
  );
};

export function start(sourcecode: string, start: number) {
  const ast = parse(sourcecode, { plugins: ["jsx"] });
  traverse(ast, {
    JSXElement(path) {
      try {
        const _start = path.node.openingElement.start ?? Infinity;
        const _end = path.node.openingElement.end ?? -Infinity;
        if (start < _start || start > _end) {
          return;
        }
        const parentJsxElement = createParentJsxElement(path.node);
        path.replaceWith(parentJsxElement);
        path.skip();
      } catch (error) {
        console.error(error);
      }
    },
  });
  const { code } = generate(ast, {
    jsescOption: {
      minimal: false,
    },
  });
  return code;
}
