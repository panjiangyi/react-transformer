import * as ts from 'typescript'
import { factory } from 'typescript'

export const createConditionalExpression = (
  alreadyHasConditional: boolean,
  variableName: string,
  trueExpression: ts.Expression,
  falseExpression?: ts.Expression,
) => {
  const child = factory.createConditionalExpression(
    factory.createIdentifier(variableName),
    factory.createToken(ts.SyntaxKind.QuestionToken),
    trueExpression,
    factory.createToken(ts.SyntaxKind.ColonToken),
    falseExpression ?? factory.createIdentifier('null'),
  )

  if (alreadyHasConditional) {
    return child
  }

  return factory.createJsxExpression(undefined, child)
}
