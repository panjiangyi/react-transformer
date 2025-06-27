import * as vscode from 'vscode'
import ts from 'typescript'
import { createForward } from '../lib/create-forward'
import { createImportForwardRef } from '../lib/create-import-forwardRef'
import transformSourceFileWithVisitor from '../lib/transformSourceFileWithVisitor'
import { printNode } from '../lib/printNode'
import { getSourceFile } from '../lib/getSourceFile'

const createForwardCommand = async (context: vscode.ExtensionContext, editor: vscode.TextEditor, start: number) => {
  let originCodeRange: vscode.Range | null = null
  let newNode: ts.Node | ts.Node[] | null = null
  const getCallback = () => {
    let found = false
    return (parent: ts.Node, node: ts.Node) => {
      if (found) {
        return
      }
      if (ts.isVariableDeclaration(node)) {
        found = true
        // @ts-ignore
        const FCType = node.type?.typeArguments?.[0]
        // @ts-ignore
        node.type = undefined
        // @ts-ignore
        node.initializer = createForward(FCType, node.initializer)
        originCodeRange = new vscode.Range(
          editor.document.positionAt(node.getStart(getSourceFile(editor))),
          editor.document.positionAt(node.end),
        )
        newNode = node
      }
    }
  }

  await transformSourceFileWithVisitor(editor, start, getCallback)
  if (newNode == null) {
    throw new Error('newNode is null')
  }
  if (originCodeRange == null) {
    throw new Error('originCodeRange is null')
  }
  return {
    code: printNode(newNode, getSourceFile(editor)),
    originCodeRange,
  }
}

export default createForwardCommand
