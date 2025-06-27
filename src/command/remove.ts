import * as vscode from 'vscode'
import ts, { factory } from 'typescript'
import transformSourceFileWithVisitor from '../lib/transformSourceFileWithVisitor'
import { printNode } from '../lib/printNode'
import { getSourceFile } from '../lib/getSourceFile'
import _ from 'lodash'
import { isElement } from '../lib/isElement'

const remove = async (
  keepChildren: boolean,
  context: vscode.ExtensionContext,
  editor: vscode.TextEditor,
  start: number,
) => {
  let originCodeRange: vscode.Range | null = null
  let newNode: ts.Node | ts.Node[] | null = null
  const getCallback = () => {
    let found = false
    return (parent: ts.Node, node: ts.Node) => {
      if (found) {
        return
      }
      if (isElement(node)) {
        found = true
        originCodeRange = new vscode.Range(
          editor.document.positionAt(node.getStart(getSourceFile(editor))),
          editor.document.positionAt(node.end),
        )

        if (ts.isJsxElement(parent)) {
          if (parent.children) {
            if (!ts.isJsxSelfClosingElement(node) && keepChildren) {
              newNode = Array.from(node.children)
            }
          }
        }
      }
    }
  }
  await transformSourceFileWithVisitor(editor, start, getCallback)

  if (originCodeRange == null) {
    throw new Error('originCodeRange is null')
  }
  return {
    code: newNode == null ? '' : printNode(newNode, getSourceFile(editor)),
    originCodeRange,
  }
}

export const removeWrapper = remove.bind(null, true)

export const removeAll = remove.bind(null, false)
