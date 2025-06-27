import * as vscode from 'vscode'
import ts, { factory } from 'typescript'
import transformSourceFileWithVisitor from '../lib/transformSourceFileWithVisitor'
import { createWrap } from '../lib/wrap-creator'
import { printNode } from '../lib/printNode'
import { getSourceFile, getSourceFileFromString } from '../lib/getSourceFile'
import { createConditionalExpression } from '../lib/createConditionalExpression'
import { isElement } from '../lib/isElement'
import { Selection } from '../def'

const createConditionalExpressionCommand = async (
  context: vscode.ExtensionContext,
  editor: vscode.TextEditor,
  start: number,
  extra?: Selection,
) => {
  let originCodeRange: vscode.Range | null = null
  let newNode: ts.Node | ts.Node[] | null = null
  if (extra != null && extra.selectedText != null) {
    const sourceFile = getSourceFileFromString(extra.selectedText)
    // @ts-expect-error
    const hasMultipleChildren = ts.isBinaryExpression(sourceFile.statements[0].expression)
    const selectedText = hasMultipleChildren ? `<>${extra.selectedText}</>` : extra.selectedText
    return {
      code: `
      {
      __placeholder__?
          ${selectedText}:
        <></>
      }
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
        newNode = createConditionalExpression('__placeholder__', node)
        originCodeRange = new vscode.Range(
          editor.document.positionAt(node.getStart(getSourceFile(editor))),
          editor.document.positionAt(node.end),
        )
      } else if (ts.isJsxText(node)) {
        found = true
        newNode = createConditionalExpression(
          '__placeholder__',
          factory.createJsxFragment(factory.createJsxOpeningFragment(), [node], factory.createJsxJsxClosingFragment()),
        )
        originCodeRange = new vscode.Range(
          editor.document.positionAt(node.getStart(getSourceFile(editor))),
          editor.document.positionAt(node.end),
        )
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

export default createConditionalExpressionCommand
