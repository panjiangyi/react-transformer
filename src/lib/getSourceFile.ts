import * as vscode from "vscode";
import ts from "typescript";

export const getSourceFile = (editor: vscode.TextEditor) => {
  const program = ts.createProgram([editor.document.fileName], {
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.Preserve,
    target: ts.ScriptTarget.Latest,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    allowJs: true,
    checkJs: false,
  });
  return program.getSourceFile(editor.document.fileName)!;
};