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

export function start(sourcecode: string) {
  const ast = parse(sourcecode, { plugins: ["jsx"] });
  traverse(ast, {
    JSXElement(path) {
      try {
        // const text = path.toString();
        // console.log(text);
        if (path?.node?.openingElement?.name?.name === "a") {
          const parentJsxElement = createParentJsxElement(path.node);
          path.replaceWith(parentJsxElement);
          path.skip();
        }
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
