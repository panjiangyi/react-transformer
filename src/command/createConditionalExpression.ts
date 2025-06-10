import * as vscode from 'vscode'
import ts, { factory } from 'typescript'
import transformSourceFileWithVisitor from '../lib/transformSourceFileWithVisitor'
import { createWrap } from '../lib/wrap-creator'
import { printNode } from '../lib/printNode'
import { getSourceFile } from '../lib/getSourceFile'
import { createConditionalExpression } from '../lib/createConditionalExpression'

const createConditionalExpressionCommand = async (editor: vscode.TextEditor, start: number) => {
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

export default createConditionalExpressionCommand
