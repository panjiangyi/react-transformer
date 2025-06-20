import * as vscode from 'vscode'
import ts from 'typescript'
import transformSourceFileWithVisitor from '../lib/transformSourceFileWithVisitor'
import { printNode } from '../lib/printNode'
import { getSourceFile } from '../lib/getSourceFile'
import { isElement } from '../lib/isElement'

const swapWithNextSibling = async (editor: vscode.TextEditor, start: number) => {
  let swapped = false
  let originCodeRange: vscode.Range | null = null
  let newNode: ts.Node | ts.Node[] | null = null
  const getCallback = () => {
    return (parent: ts.Node, node: ts.Node) => {
      if (swapped) {
        return
      }
      if (isElement(node) && ts.isJsxElement(parent)) {
        // Find the index of the node in parent's children
        const idx = parent.children.findIndex(child => child === node)
        if (idx !== -1 && idx < parent.children.length - 1) {
          // Swap with next sibling
          const newChildren = [...parent.children]
          const temp = newChildren[idx]
          newChildren[idx] = newChildren[idx + 2]
          newChildren[idx + 2] = temp
          // @ts-expect-error
          parent.children = newChildren
          newNode = parent
          originCodeRange = new vscode.Range(
            editor.document.positionAt(parent.getStart(getSourceFile(editor))),
            editor.document.positionAt(parent.end),
          )
          swapped = true
        }
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

export default swapWithNextSibling
