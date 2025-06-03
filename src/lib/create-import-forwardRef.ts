import { factory } from "typescript";

export const createImportForwardRef = () => {
  return factory.createImportDeclaration(
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamedImports([
        factory.createImportSpecifier(
          false,
          undefined,
          factory.createIdentifier("forwardRef")
        ),
      ])
    ),
    factory.createStringLiteral("react"),
    undefined
  );
};
