import * as vscode from "vscode";
import ts from "typescript";
import { createWrap } from "./lib/wrap-creator";
import _ from "lodash";
import { askForTag } from "./lib/askForTag";

function visitor(
  parent: ts.Node,
  node: ts.Node,
  start: number,
  callback: (parent: ts.Node, node: ts.Node) => void
) {
  node.forEachChild((child) => {
    visitor(node, child, start, callback);
  });
  if (start >= node.pos && start <= node.end) {
    callback(parent, node);
  }
}

export const wrapWithDiv = async (editor: vscode.TextEditor, start: number) => {
  let tagName = await askForTag();

  const program = ts.createProgram([editor.document.fileName], {
    module: ts.ModuleKind.ESNext,
  });

  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
  });
  let sourcecode = editor.document.getText();
  for (const rootFileName of program.getRootFileNames()) {
    const sourceFile = program.getSourceFile(rootFileName);
    if (sourceFile == null) {
      continue;
    }

    if (sourceFile && !sourceFile.isDeclarationFile) {
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
      sourceFile.forEachChild((node) => {
        visitor(sourceFile, node, start, getCallback());
      });
    }

    sourcecode = printer.printNode(
      ts.EmitHint.Unspecified,
      sourceFile,
      sourceFile
    );
  }
  vscode.window.showInformationMessage("wrapWithDiv");
  return sourcecode;
};
