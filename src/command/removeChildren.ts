import * as vscode from 'vscode'
import ts from 'typescript'
import transformSourceFileWithVisitor from '../lib/transformSourceFileWithVisitor'
import { printNode } from '../lib/printNode'
import { getSourceFile } from '../lib/getSourceFile'
import { createWrap } from '../lib/wrap-creator'
import { isElement } from '../lib/isElement'

const removeChildrenCommand = async (editor: vscode.TextEditor, start: number) => {
  let originCodeRange: vscode.Range | null = null
  let newNode: ts.Node | null = null
  const getCallback = () => {
    let found = false
    return (parent: ts.Node, node: ts.Node) => {
      if (found) {
        return
      }
      if (ts.isJsxFragment(node) || ts.isJsxElement(node)) {
        found = true
        originCodeRange = new vscode.Range(
          editor.document.positionAt(node.getStart(getSourceFile(editor))),
          editor.document.positionAt(node.end),
        )
        //@ts-expect-error
        node.children = []
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

export default removeChildrenCommand
