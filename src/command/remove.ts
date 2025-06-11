import * as vscode from 'vscode'
import ts from 'typescript'
import transformSourceFileWithVisitor from '../lib/transformSourceFileWithVisitor'
import { printNode } from '../lib/printNode'
import { getSourceFile } from '../lib/getSourceFile'
import _ from 'lodash'

const remove = async (editor: vscode.TextEditor, start: number) => {
  let originCodeRange: vscode.Range | null = null
  let newNode: ts.Node | ts.Node[] | null = null
  const getCallback = () => {
    let found = false
    return (parent: ts.Node, node: ts.Node) => {
      if (found) {
        return
      }
      if (ts.isJsxElement(node)) {
        found = true

        if (ts.isJsxElement(parent)) {
          if (parent.children) {
            originCodeRange = new vscode.Range(
              editor.document.positionAt(node.getStart(getSourceFile(editor))),
              editor.document.positionAt(node.end),
            )
            newNode = Array.from(node.children)
          }
        }
      }
    }
  }
  await transformSourceFileWithVisitor(editor, start, getCallback, undefined, 'success')
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

export default remove
