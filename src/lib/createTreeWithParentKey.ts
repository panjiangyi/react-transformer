import ts from 'typescript'

declare module 'typescript' {
  interface Node {
    __parent__?: Node
  }
}

function loop<T extends ts.Node>(node: T) {
  node.forEachChild(child => {
    child.__parent__ = node
    child.forEachChild(subNode => {
      subNode.__parent__ = child
      loop(subNode)
    })
  })
  return node
}

export const createTreeWithParentKey = (sourceFile: ts.SourceFile | null | undefined) => {
  if (sourceFile == null) {
    return null
  }
  loop(sourceFile)
}
