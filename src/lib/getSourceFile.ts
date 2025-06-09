import * as vscode from "vscode";
import ts from "typescript";

export const getSourceFile = (editor: vscode.TextEditor) => {
  const program = ts.createProgram([editor.document.fileName], {
    module: ts.ModuleKind.ESNext,
  });
  return program.getSourceFile(editor.document.fileName)!;
};