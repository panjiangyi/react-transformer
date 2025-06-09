import * as vscode from "vscode";
import ts from "typescript";
import visitor from "./visitor";
import { createTreeWithParentKey } from "./createTreeWithParentKey";

async function transformSourceFileWithVisitor(
  editor: vscode.TextEditor,
  start: number,
  getCallback: (
    sourceFile: ts.SourceFile
  ) => (parent: ts.Node, node: ts.Node) => void,
  preVisitMutateSourceFile?: (sourceFile: ts.SourceFile) => void,
  message?: string
) {
  const program = ts.createProgram([editor.document.fileName], {
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.Preserve,
    target: ts.ScriptTarget.Latest,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    allowJs: true,
    checkJs: false,
  });

  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
  });
  let sourcecode = editor.document.getText();
  const rootFileName = editor.document.fileName;
  const sourceFile = createTreeWithParentKey(
    program.getSourceFile(rootFileName)
  );
  if (sourceFile != null && !sourceFile.isDeclarationFile) {
    if (preVisitMutateSourceFile) {
      preVisitMutateSourceFile(sourceFile);
    }
    sourceFile.forEachChild((node) => {
      visitor(sourceFile, node, start, getCallback(sourceFile));
    });
    sourcecode = printer.printNode(
      ts.EmitHint.Unspecified,
      sourceFile,
      sourceFile
    );
  }
  if (message) {
    vscode.window.showInformationMessage(message);
  }
  return sourcecode;
}

export default transformSourceFileWithVisitor;
