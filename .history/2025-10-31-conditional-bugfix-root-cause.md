# Root Cause Summary: Conditional Expression Bugfix

## Background

- The `createConditionalExpression` helper always returned a `JsxExpression` node wrapping the generated conditional AST.
- The command that invokes it replaces either a JSX element or text node, regardless of whether the selection is already inside an existing JSX expression container.

## Root Cause

- When the target node already lived beneath a `JsxExpression`, inserting another `JsxExpression` produced nested expression containers.
- This mismatch led the printer to emit malformed JSX (extra braces) and prevented the transformation from yielding valid output.

## Resolution

- Introduced `getClosestAncestorJsxKind` to detect whether the selection is already under a `JsxExpression` ancestor.
- Updated `createConditionalExpression` (and related command logic) to skip the extra wrapper when one already exists, returning the bare conditional expression instead.

## Result

- Eliminates duplicate JSX expression wrappers, keeping the generated code syntactically correct across both JSX elements and text selections.
