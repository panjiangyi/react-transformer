import { factory, JsxChild } from "typescript";
export const createWrap = (tag: string|null|undefined, children: Array<JsxChild>) => {
  if (tag == null) {
    return factory.createJsxFragment(factory.createJsxOpeningFragment(),children,factory.createJsxJsxClosingFragment());
  }
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
