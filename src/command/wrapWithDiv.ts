import * as vscode from 'vscode'
import ts from 'typescript'
import { askForTag } from '../lib/askForTag'
import { createWrap } from '../lib/wrap-creator'
import transformSourceFileWithVisitor from '../lib/transformSourceFileWithVisitor'
import { printNode } from '../lib/printNode'
import { getSourceFile, getSourceFileFromString } from '../lib/getSourceFile'
import { isElement } from '../lib/isElement'
import { Selection } from '../def'

const wrapWithDiv = async (editor: vscode.TextEditor, start: number, extra?: Selection) => {
  let tagName = await askForTag()

  let originCodeRange: vscode.Range | null = null
  let newNode: ts.Node | ts.Node[] | null = null

  if (extra != null && extra.selectedText != null) {
    return {
      code: `
      <${tagName}>
          ${extra.selectedText}
      </${tagName}>
      `,
      originCodeRange: new vscode.Range(
        editor.document.positionAt(extra.selectionStartOffset),
        editor.document.positionAt(extra.selectionEndOffset),
      ),
    }
  }

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
        newNode = createWrap(tagName, [node])
      }
    }
  }
  await transformSourceFileWithVisitor(editor, start, getCallback)
  if (newNode == null) {
    throw new Error('newCode is null')
  }
  if (originCodeRange == null) {
    throw new Error('originCodeRange is null')
  }
  return {
    code: printNode(newNode, getSourceFile(editor)),
    originCodeRange,
  }
}

export default wrapWithDiv
