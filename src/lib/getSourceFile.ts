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
 * 从字符串创建一个 TypeScript SourceFile 对象
 * @param code 源代码字符串
 * @param fileName 虚拟文件名，默认为 'temp.tsx'
 * @returns ts.SourceFile
 */
export const getSourceFileFromString = (code: string, fileName = 'temp.tsx'): ts.SourceFile => {
  return ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, /*setParentNodes*/ true, ts.ScriptKind.TSX)
}
