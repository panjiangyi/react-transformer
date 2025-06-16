import ts from 'typescript'

export const isElement = (node: ts.Node): node is ts.JsxElement | ts.JsxFragment | ts.JsxSelfClosingElement => {
  return ts.isJsxElement(node) || ts.isJsxFragment(node) || ts.isJsxSelfClosingElement(node)
}
