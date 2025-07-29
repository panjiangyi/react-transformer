import * as vscode from 'vscode'
import ts from 'typescript'

export const getSourceFile = (editor: vscode.TextEditor) => {
  const program = ts.createProgram([editor.document.fileName], {
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.Preserve,
    target: ts.ScriptTarget.Latest,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    allowJs: true,
    checkJs: false,
  })
  return program.getSourceFile(editor.document.fileName)!
}

/**
 * Create a TypeScript SourceFile object from a string
 * @param code Source code string
 * @param fileName Virtual file name, defaults to 'temp.tsx'
 * @returns ts.SourceFile
 */
export const getSourceFileFromString = (code: string, fileName = 'temp.tsx'): ts.SourceFile => {
  return ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, /*setParentNodes*/ true, ts.ScriptKind.TSX)
}
