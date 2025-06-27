import ts, { factory, JsxChild } from 'typescript'

const createPropertyAccessExpression = (...args: string[]): ts.Expression => {
  const argsCopy = [...args]
  if (args.length <= 0) {
    throw new Error('args is empty')
  }
  if (args.length === 1) {
    return factory.createIdentifier(args[0])
  }
  const last = argsCopy.pop()
  const others = argsCopy
  if (args.length === 2) {
    return factory.createPropertyAccessExpression(factory.createIdentifier(args[0]), factory.createIdentifier(args[1]))
  }
  if (last == null) {
    throw new Error('last is null')
  }

  return factory.createPropertyAccessExpression(
    createPropertyAccessExpression(...others),
    factory.createIdentifier(last),
  )
}
export const createWrap = (tag: string | null | undefined, children: Array<JsxChild>) => {
  if (tag == null) {
    return factory.createJsxFragment(
      factory.createJsxOpeningFragment(),
      children,
      factory.createJsxJsxClosingFragment(),
    )
  }
  const tags = tag.split('.')
  const tagElement = createPropertyAccessExpression(...tags) as ts.JsxTagNameExpression
  return factory.createJsxElement(
    factory.createJsxOpeningElement(tagElement, undefined, factory.createJsxAttributes([])),
    children,
    factory.createJsxClosingElement(tagElement),
  )
}
