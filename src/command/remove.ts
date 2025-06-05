import * as vscode from "vscode";
import ts from "typescript";
import transformSourceFileWithVisitor from "../lib/transformSourceFileWithVisitor";
import { createWrap } from "../lib/wrap-creator";

const remove = async (editor: vscode.TextEditor, start: number) => {
  const getCallback = () => {
    let found = false;
    return (parent: ts.Node, node: ts.Node) => {
      if (found) {
        return;
      }
      if (ts.isJsxElement(node)) {
        found = true;
        if (ts.isJsxElement(parent)) {
          if (parent.children) {
            // @ts-expect-error
            parent.children = parent.children
              .map((child) => {
                if (child === node) {
                  return child.children;
                }
                return child;
              })
              .flat();
          }
        }
      }
    };
  };
  return transformSourceFileWithVisitor(
    editor,
    start,
    getCallback,
    undefined,
    "success"
  );
};

export default remove;
