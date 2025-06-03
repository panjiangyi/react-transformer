import * as ts from "typescript";
import { factory } from "typescript";

export const createForward = (
  type: ts.TypeNode | undefined,
  initializer: any
) => {
  if (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer)) {
    const firstParam =
      initializer.parameters[0] ??
      factory.createParameterDeclaration(
        undefined,
        undefined,
        factory.createIdentifier("_"),
        undefined,
        undefined,
        undefined
      );
    // @ts-ignore
    initializer.parameters = [
      firstParam,
      factory.createParameterDeclaration(
        undefined,
        undefined,
        factory.createIdentifier("ref"),
        undefined,
        undefined,
        undefined
      ),
    ];
  }
  return factory.createCallExpression(
    factory.createIdentifier("forwardRef"),
    [
      factory.createTypeReferenceNode(
        factory.createIdentifier("unknown"),
        undefined
      ),
      type ?? factory.createTypeLiteralNode([]),
    ],
    [
      // put render function here
      initializer,
    ]
  );
};
