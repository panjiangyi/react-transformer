import * as vscode from "vscode";
import ts from "typescript";
import transformSourceFileWithVisitor from "../lib/transformSourceFileWithVisitor";
import { createWrap } from "../lib/wrap-creator";
import { printNode } from "../lib/printNode";
import { getSourceFile } from "../lib/getSourceFile";

const remove = async (editor: vscode.TextEditor, start: number) => {
  let originCodeRange: vscode.Range | null = null;
  let newNode: ts.Node | ts.Node[] | null = null;
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
            originCodeRange = new vscode.Range(
              editor.document.positionAt(node.getStart(getSourceFile(editor))),
              editor.document.positionAt(parent.end)
            );
            newNode = parent
          }
        }
      }
    };
  };
  await transformSourceFileWithVisitor(
    editor,
    start,
    getCallback,
    undefined,
    "success"
  );
  if (newNode == null) {
    throw new Error("newNode is null");
  }
  if (originCodeRange == null) {
    throw new Error("originCodeRange is null");
  }
  return {
    code: printNode(newNode),
    originCodeRange,
  };
};

export default remove;
