import * as vscode from "vscode";
import ts from "typescript";
import { askForTag } from "../lib/askForTag";
import { createWrap } from "../lib/wrap-creator";
import transformSourceFileWithVisitor from "../lib/transformSourceFileWithVisitor";

const wrapWithDiv = async (editor: vscode.TextEditor, start: number) => {
  let tagName = await askForTag();
  const getCallback = () => {
    let found = false;
    return (parent: ts.Node, node: ts.Node) => {
      if (found) {
        return;
      }
      if (ts.isJsxElement(node)) {
        found = true;
        if (ts.isParenthesizedExpression(parent)) {
          // @ts-ignore
          parent.expression = createWrap(tagName, [node]);
        } else if (ts.isJsxElement(parent)) {
          // @ts-ignored
          parent.children = parent.children.map((child) => {
            if (child === node) {
              return createWrap(tagName, [node]);
            }
            return child;
          });
        }
      }
    };
  };
  return transformSourceFileWithVisitor(
    editor,
    start,
    getCallback,
    undefined,
    "wrapWithDiv"
  );
};

export default wrapWithDiv;
