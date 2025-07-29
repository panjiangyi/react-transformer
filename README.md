# React Transformer

A powerful VSCode extension that helps you efficiently refactor and transform React (JSX/TSX) code!  
One-click refactoring, wrapping, swapping, and transforming JSX elements.

---

## Features

- **Wrap JSX with any tag** (default Fragment)
- **Swap position with next sibling JSX element**
- **Create forwardRef wrapper**
- **Remove JSX element and promote its children**
- **Convert JSX to && expression**
- **Convert JSX to conditional (ternary) expression**

---

## Commands and Usage

| Command Name                                                                            | Description                                                   | Usage                                                                                                         |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Wrap with new tag**<br/>`react-transformer.warp_it`                                   | Wrap selected JSX element with custom tag (default Fragment). | Place cursor inside JSX element, right-click and select "Wrap with new tag", or use command palette.          |
| **Swap with next sibling**<br/>`react-transformer.swap_with_next_sibling`               | Swap position with next sibling JSX element.                  | Place cursor inside JSX element, right-click and select "Swap with next sibling", or use command palette.     |
| **Create forward**<br/>`react-transformer.create_forward`                               | Convert function component to `React.forwardRef`.             | Place cursor on function component variable, right-click and select "Create forward", or use command palette. |
| **Remove**<br/>`react-transformer.remove`                                               | Remove selected JSX element and promote its children.         | Place cursor inside JSX element, right-click and select "Remove", or use command palette.                     |
| **Create ampersand expression**<br/>`react-transformer.create_ampersand_expression`     | Wrap JSX with `{condition && <JSX>}`.                         | Place cursor inside JSX, right-click and select "Create ampersand expression", or use command palette.        |
| **Create conditional expression**<br/>`react-transformer.create_conditional_expression` | Wrap JSX with `{condition ? <JSX> : null}`.                   | Place cursor inside JSX, right-click and select "Create conditional expression", or use command palette.      |
|                                                                                         |

### Keyboard Shortcuts

You can press **Shift + Ctrl + R** to quickly open the refactor menu.

### Right-click Menu

All commands are accessible via right-click menu when editing React files.

---

## Examples

### 1. Wrap with new tag

![Wrap with new tag demo](https://tc.z.wiki/autoupload/zaULi4JOscQ5PNU-6EE30DL8PHO0F-8EkaRRFSZtoNuyl5f0KlZfm6UsKj-HyTuv/20250702/pKk3/600X494/assets/wrap-with-tag.gif)

### 2. Swap with next sibling element

![Swap with next sibling demo](https://tc.z.wiki/autoupload/zaULi4JOscQ5PNU-6EE30DL8PHO0F-8EkaRRFSZtoNuyl5f0KlZfm6UsKj-HyTuv/20250702/dKTD/600X494/assets/swap-sibling.gif)

### 3. Create forwardRef

![Create forwardRef demo](https://tc.z.wiki/autoupload/zaULi4JOscQ5PNU-6EE30DL8PHO0F-8EkaRRFSZtoNuyl5f0KlZfm6UsKj-HyTuv/20250702/ZBHv/600X494/assets/forward-ref.gif)

### 4. Remove JSX element

![Remove JSX demo](https://tc.z.wiki/autoupload/zaULi4JOscQ5PNU-6EE30DL8PHO0F-8EkaRRFSZtoNuyl5f0KlZfm6UsKj-HyTuv/20250702/yLwB/600X338/assets/remove-jsx.gif)

### 5. Convert to conditional statement

![Remove JSX demo](https://tc.z.wiki/autoupload/zaULi4JOscQ5PNU-6EE30DL8PHO0F-8EkaRRFSZtoNuyl5f0KlZfm6UsKj-HyTuv/20250702/hVLE/600X494/assets/ampersand-expression.gif)

### 6. Convert to ternary expression

![Remove JSX demo](https://tc.z.wiki/autoupload/zaULi4JOscQ5PNU-6EE30DL8PHO0F-8EkaRRFSZtoNuyl5f0KlZfm6UsKj-HyTuv/20250702/0uF6/600X494/assets/conditional-expression.gif)

---

## Installation

1. Open the Extensions panel in VS Code (Ctrl+Shift+X)
2. Search for "React Transformer"
3. Click Install

## Support

If you like this extension, please give it a ⭐️ for support!

## License

MIT License
