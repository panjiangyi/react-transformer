import ts from 'typescript'

export const getClosestAncestorJsxKind = (node: ts.Node): 'jsxElement' | 'jsxExpression' | null => {
  let current: ts.Node | undefined = node.__parent__

  while (current) {
    if (ts.isJsxElement(current)) {
      return 'jsxElement'
    }

    if (ts.isJsxExpression(current)) {
      return 'jsxExpression'
    }

    current = current.__parent__
  }

  return null
}

export default getClosestAncestorJsxKind
