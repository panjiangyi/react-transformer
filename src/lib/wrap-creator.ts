import { factory, JsxChild } from "typescript";
export const createWrap = (tag: string, children: Array<JsxChild>) => {
  return factory.createJsxElement(
    factory.createJsxOpeningElement(
      factory.createIdentifier(tag),
      undefined,
      factory.createJsxAttributes([])
    ),
    children,
    factory.createJsxClosingElement(factory.createIdentifier(tag))
  );
};
