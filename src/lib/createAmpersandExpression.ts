import * as ts from 'typescript'
import { factory } from 'typescript'

export const createAmpersandExpression = (leftExpressionName: string, rightExpression: ts.Expression) => {
  return factory.createJsxExpression(
    undefined,
    factory.createBinaryExpression(
      factory.createIdentifier(leftExpressionName),
      factory.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
      rightExpression,
    ),
  )
}
