import * as vscode from 'vscode'
import ts from 'typescript'
import visitor from './visitor'
import { createTreeWithParentKey } from './createTreeWithParentKey'
import { getSourceFile } from './getSourceFile'

async function transformSourceFileWithVisitor(
  editor: vscode.TextEditor,
  start: number,
  getCallback: (sourceFile: ts.SourceFile) => (parent: ts.Node, node: ts.Node) => void,
) {
  const sourceFile = getSourceFile(editor)
  if (sourceFile != null && !sourceFile.isDeclarationFile) {
    sourceFile.forEachChild(node => {
      visitor(sourceFile, node, start, getCallback(sourceFile))
    })
  }
}

export default transformSourceFileWithVisitor
