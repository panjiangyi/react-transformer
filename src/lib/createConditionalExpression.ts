import * as ts from 'typescript'
import { factory } from 'typescript'

export const createConditionalExpression = (
  variableName: string,
  trueExpression: ts.Expression,
  falseExpression?: ts.Expression,
) => {
  return factory.createJsxExpression(
    undefined,
    factory.createConditionalExpression(
      factory.createIdentifier(variableName),
      factory.createToken(ts.SyntaxKind.QuestionToken),
      trueExpression,
      factory.createToken(ts.SyntaxKind.ColonToken),
      falseExpression ?? factory.createIdentifier('null'),
    ),
  )
}
