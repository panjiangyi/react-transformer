import * as vscode from "vscode";
import ts from "typescript";
import transformSourceFileWithVisitor from "../lib/transformSourceFileWithVisitor";

const swapWithNextSibling = async (
  editor: vscode.TextEditor,
  start: number
) => {
  let swapped = false;
  const getCallback = () => {
    return (parent: ts.Node, node: ts.Node) => {
      if (swapped) {
        return;
      }
      if (ts.isJsxElement(node) && ts.isJsxElement(parent)) {
        // Find the index of the node in parent's children
        const idx = parent.children.findIndex((child) => child === node);
        if (idx !== -1 && idx < parent.children.length - 1) {
          // Swap with next sibling
          const newChildren = [...parent.children];
          const temp = newChildren[idx];
          newChildren[idx] = newChildren[idx + 2];
          newChildren[idx + 2] = temp;
          // @ts-ignore
          parent.children = newChildren;
          swapped = true;
        }
      }
    };
  };
  return transformSourceFileWithVisitor(
    editor,
    start,
    getCallback,
    undefined,
    swapped
      ? "Swapped JSX element with its next sibling"
      : "No JSX sibling to swap with"
  );
};

export default swapWithNextSibling;
