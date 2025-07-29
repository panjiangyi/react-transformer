import * as vscode from 'vscode'
import ts from 'typescript'
import transformSourceFileWithVisitor from './transformSourceFileWithVisitor'

/**
 * Higher-order function that traverses the syntax tree, finds the first node that meets the condition and processes it
 * @param editor vscode.TextEditor
 * @param start number
 * @param match (parent, node) => boolean | node is X  // Check if matched
 * @param onFound (parent, node) => any    // Process after match
 * @returns Return value of onFound
 */
type GuardFunction<T extends ts.Node = ts.Node, U extends ts.Node = ts.Node> = (parent: T, node: ts.Node) => node is U

type NormalFunction<T extends ts.Node = ts.Node> = (parent: T, node: ts.Node) => boolean

// Type gymnastics: if match is a type guard, then the node type of onFound is the narrowed type, otherwise it's ts.Node
async function findAndOperateOnNode<
  TParent extends ts.Node = ts.Node,
  TMatch extends NormalFunction<TParent> | GuardFunction<TParent, any> = NormalFunction<TParent>,
  TOnFoundResult = any,
>(
  editor: vscode.TextEditor,
  start: number,
  match: TMatch,
  onFound: TMatch extends GuardFunction<TParent, infer U>
    ? (parent: TParent, node: U) => TOnFoundResult
    : (parent: TParent, node: ts.Node) => TOnFoundResult,
): Promise<TOnFoundResult> {
  let result: TOnFoundResult | null = null
  const getCallback = () => {
    let found = false
    return (parent: ts.Node, node: ts.Node) => {
      if (found) return
      if (match(parent as TParent, node)) {
        found = true
        result = onFound(parent as TParent, node as any)
      }
    }
  }
  await transformSourceFileWithVisitor(editor, start, getCallback)
  if (result == null) throw new Error('No node found')
  return result
}

export default findAndOperateOnNode
