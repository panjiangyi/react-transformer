import * as ts from 'typescript'
import { factory } from 'typescript'

export const createAmpersandExpression = (
  alreadyHasAmpersand: boolean,
  leftExpressionName: string,
  rightExpression: ts.Expression,
) => {
  const child = factory.createBinaryExpression(
    factory.createIdentifier(leftExpressionName),
    factory.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
    rightExpression,
  )
  if (alreadyHasAmpersand) {
    return child
  }
  return factory.createJsxExpression(undefined, child)
}
