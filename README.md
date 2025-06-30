# React Transformer

A powerful VSCode extension to supercharge your React (JSX/TSX) workflow!  
Easily refactor, wrap, swap, and transform JSX elements with a single click or shortcut.

---

## Features

- **Wrap JSX with any tag** (default: Fragment)
- **Swap JSX elements with their next sibling**
- **Create forwardRef wrappers**
- **Remove JSX elements, promoting their children**
- **Transform JSX into ampersand (`&&`) expressions**
- **Transform JSX into conditional (`? :`) expressions**
- **Quick Refactor Menu for all actions**

---

## Installation

1. Download or install from the [VSCode Marketplace](https://marketplace.visualstudio.com/).
2. Open any JavaScript/TypeScript file with JSX.
3. Right-click in the editor or use the command palette to access features.

---

## Commands & Usage

| Command Name                                                                            | Description                                                                   | How to Use                                                                                                 |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Wrap with new tag**<br/>`react-transformer.warp_it`                                   | Wraps the selected JSX element with a tag of your choice (default: Fragment). | Place cursor inside a JSX element, right-click → "Wrap with new tag", or use the command palette.          |
| **Swap with next sibling**<br/>`react-transformer.swap_with_next_sibling`               | Swaps the current JSX element with its next sibling.                          | Place cursor inside a JSX element, right-click → "Swap with next sibling", or use the command palette.     |
| **Create forward**<br/>`react-transformer.create_forward`                               | Converts a function component to use `React.forwardRef`.                      | Place cursor on a function component variable, right-click → "Create forward", or use the command palette. |
| **Remove**<br/>`react-transformer.remove`                                               | Removes the selected JSX element, promoting its children.                     | Place cursor inside a JSX element, right-click → "Remove", or use the command palette.                     |
| **Create ampersand expression**<br/>`react-transformer.create_ampersand_expression`     | Wraps the JSX in a `{condition && <JSX>}` expression.                         | Place cursor inside JSX, right-click → "Create ampersand expression", or use the command palette.          |
| **Create conditional expression**<br/>`react-transformer.create_conditional_expression` | Wraps the JSX in a `{condition ? <JSX> : null}` expression.                   | Place cursor inside JSX, right-click → "Create conditional expression", or use the command palette.        |
| **Show Refactor Menu**<br/>`react-transformer.showRefactorMenu`                         | Opens a quick menu to access all refactorings.                                | Open command palette and run "Show Refactor Menu".                                                         |

### Context Menu

All commands are available in the editor context menu when editing JavaScript/TypeScript (React) files.

---

## Example

### 1. Wrap with new tag

![Wrap with new tag demo](https://gitee.com/Mogician301/react-transformer/raw/master/wrap-with-tag.gif)

### 2. Swap with next sibling

![Swap with next sibling demo](https://gitee.com/Mogician301/react-transformer/raw/master/swap-sibling.gif)

### 3. Create forwardRef

![Create forwardRef demo](https://gitee.com/Mogician301/react-transformer/raw/master/forward-ref.gif)

### 4. Remove JSX element

![Remove JSX demo](https://gitee.com/Mogician301/react-transformer/raw/master/remove-jsx.gif)

### 5. Refactor Menu

![Refactor Menu demo](https://gitee.com/Mogician301/react-transformer/raw/master/refactor-menu.gif)

---

# React Transformer

一个强大的 VSCode 扩展，助你高效重构和转换 React (JSX/TSX) 代码！  
一键重构、包裹、交换、转换 JSX 元素。

---

## 功能

- **用任意标签包裹 JSX**（默认 Fragment）
- **与下一个兄弟 JSX 元素交换位置**
- **创建 forwardRef 包裹**
- **移除 JSX 元素并提升其子元素**
- **将 JSX 转换为 && 表达式**
- **将 JSX 转换为条件（三元）表达式**
- **一键弹出重构菜单**

---

## 安装

1. 从 [VSCode Marketplace](https://marketplace.visualstudio.com/) 下载或安装。
2. 打开任意包含 JSX 的 JS/TS 文件。
3. 右键或使用命令面板访问功能。

---

## 命令与用法

| 命令名称                                                                                | 描述                                               | 用法                                                                     |
| --------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------ |
| **Wrap with new tag**<br/>`react-transformer.warp_it`                                   | 用自定义标签包裹选中的 JSX 元素（默认 Fragment）。 | 光标放在 JSX 元素内，右键选择"Wrap with new tag"，或用命令面板。         |
| **Swap with next sibling**<br/>`react-transformer.swap_with_next_sibling`               | 与下一个兄弟 JSX 元素交换位置。                    | 光标放在 JSX 元素内，右键选择"Swap with next sibling"，或用命令面板。    |
| **Create forward**<br/>`react-transformer.create_forward`                               | 将函数组件转换为 `React.forwardRef`。              | 光标放在函数组件变量上，右键选择"Create forward"，或用命令面板。         |
| **Remove**<br/>`react-transformer.remove`                                               | 移除选中的 JSX 元素并提升其子元素。                | 光标放在 JSX 元素内，右键选择"Remove"，或用命令面板。                    |
| **Create ampersand expression**<br/>`react-transformer.create_ampersand_expression`     | 用 `{condition && <JSX>}` 包裹 JSX。               | 光标放在 JSX 内，右键选择"Create ampersand expression"，或用命令面板。   |
| **Create conditional expression**<br/>`react-transformer.create_conditional_expression` | 用 `{condition ? <JSX> : null}` 包裹 JSX。         | 光标放在 JSX 内，右键选择"Create conditional expression"，或用命令面板。 |
| **Show Refactor Menu**<br/>`react-transformer.showRefactorMenu`                         | 弹出重构菜单，快速访问所有功能。                   | 命令面板运行"Show Refactor Menu"。                                       |

### 右键菜单

所有命令在编辑 React 文件时均可通过右键菜单访问。

---

## 示例

### 1. 用新标签包裹

![Wrap with new tag demo](https://gitee.com/Mogician301/react-transformer/raw/master/wrap-with-tag.gif)

### 2. 与下一个兄弟元素交换

![Swap with next sibling demo](https://gitee.com/Mogician301/react-transformer/raw/master/swap-sibling.gif)

### 3. 创建 forwardRef

![Create forwardRef demo](https://gitee.com/Mogician301/react-transformer/raw/master/forward-ref.gif)

### 4. 移除 JSX 元素

![Remove JSX demo](https://gitee.com/Mogician301/react-transformer/raw/master/remove-jsx.gif)

### 5. 重构菜单

![Refactor Menu demo](https://gitee.com/Mogician301/react-transformer/raw/master/refactor-menu.gif)

---

## License

MIT

---
