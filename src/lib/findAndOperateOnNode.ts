import * as vscode from 'vscode'
import ts from 'typescript'
import transformSourceFileWithVisitor from './transformSourceFileWithVisitor'

/**
 * 高阶函数，遍历语法树，找到第一个满足条件的节点并处理
 * @param editor vscode.TextEditor
 * @param start number
 * @param match (parent, node) => boolean | node is X  // 判断是否命中
 * @param onFound (parent, node) => any    // 命中后处理
 * @returns onFound 的返回值
 */
type GuardFunction<T extends ts.Node = ts.Node, U extends ts.Node = ts.Node> = (parent: T, node: ts.Node) => node is U

type NormalFunction<T extends ts.Node = ts.Node> = (parent: T, node: ts.Node) => boolean

// 类型体操：如果 match 是类型守卫，则 onFound 的 node 类型为收窄后的类型，否则为 ts.Node
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
