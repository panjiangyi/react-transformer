import * as vscode from "vscode";
import ts from "typescript";
import { askForTag } from "../lib/askForTag";
import { createWrap } from "../lib/wrap-creator";
import transformSourceFileWithVisitor from "../lib/transformSourceFileWithVisitor";
import { printNode } from "../lib/printNode";
import { getSourceFile } from "../lib/getSourceFile";

const wrapWithDiv = async (editor: vscode.TextEditor, start: number) => {
  let tagName = await askForTag();

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
        originCodeRange = new vscode.Range(
          editor.document.positionAt(node.getStart(getSourceFile(editor))),
          editor.document.positionAt(node.end)
        );
        if (ts.isParenthesizedExpression(parent)) {
          newNode = createWrap(tagName, [node]);
        } else if (ts.isJsxElement(parent)) {
          newNode = createWrap(tagName, [node]);
        }
      }
    };
  };
  await transformSourceFileWithVisitor(
    editor,
    start,
    getCallback,
    undefined,
    "wrapWithDiv"
  );
  if (newNode == null) {
    throw new Error("newCode is null");
  }
  if (originCodeRange == null) {
    throw new Error("originCodeRange is null");
  }
  return {
    code: printNode(newNode,getSourceFile(editor)),
    originCodeRange,
  };
};

export default wrapWithDiv;
