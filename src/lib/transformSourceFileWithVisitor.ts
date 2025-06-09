import * as vscode from "vscode";
import ts from "typescript";
import visitor from "./visitor";
import { createTreeWithParentKey } from "./createTreeWithParentKey";
import { getSourceFile } from "./getSourceFile";

async function transformSourceFileWithVisitor(
  editor: vscode.TextEditor,
  start: number,
  getCallback: (
    sourceFile: ts.SourceFile
  ) => (parent: ts.Node, node: ts.Node) => void,
  preVisitMutateSourceFile?: (sourceFile: ts.SourceFile) => void,
  message?: string
) {

  const sourceFile = getSourceFile(editor);
  if (sourceFile != null && !sourceFile.isDeclarationFile) {
    if (preVisitMutateSourceFile) {
      preVisitMutateSourceFile(sourceFile);
    }
    sourceFile.forEachChild((node) => {
      visitor(sourceFile, node, start, getCallback(sourceFile));
    });
  }
  if (message) {
    vscode.window.showInformationMessage(message);
  }
}

export default transformSourceFileWithVisitor;
