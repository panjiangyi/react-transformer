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
|                                                                                         |

### 快捷键

你可以按 **Shift + Ctrl + R** 快速打开重构菜单。

### 右键菜单

所有命令在编辑 React 文件时均可通过右键菜单访问。

---

## 示例

### 1. 用新标签包裹

![Wrap with new tag demo](https://tc.z.wiki/autoupload/zaULi4JOscQ5PNU-6EE30DL8PHO0F-8EkaRRFSZtoNuyl5f0KlZfm6UsKj-HyTuv/20250702/pKk3/600X494/assets/wrap-with-tag.gif)

### 2. 与下一个兄弟元素交换

![Swap with next sibling demo](https://tc.z.wiki/autoupload/zaULi4JOscQ5PNU-6EE30DL8PHO0F-8EkaRRFSZtoNuyl5f0KlZfm6UsKj-HyTuv/20250702/dKTD/600X494/assets/swap-sibling.gif)

### 3. 创建 forwardRef

![Create forwardRef demo](https://tc.z.wiki/autoupload/zaULi4JOscQ5PNU-6EE30DL8PHO0F-8EkaRRFSZtoNuyl5f0KlZfm6UsKj-HyTuv/20250702/ZBHv/600X494/assets/forward-ref.gif)

### 4. 移除 JSX 元素

![Remove JSX demo](https://tc.z.wiki/autoupload/zaULi4JOscQ5PNU-6EE30DL8PHO0F-8EkaRRFSZtoNuyl5f0KlZfm6UsKj-HyTuv/20250702/yLwB/600X338/assets/remove-jsx.gif)

### 5.转换为条件语句

![Remove JSX demo](https://tc.z.wiki/autoupload/zaULi4JOscQ5PNU-6EE30DL8PHO0F-8EkaRRFSZtoNuyl5f0KlZfm6UsKj-HyTuv/20250702/hVLE/600X494/assets/ampersand-expression.gif)

### 6. 转换为三元表达式

![Remove JSX demo](https://tc.z.wiki/autoupload/zaULi4JOscQ5PNU-6EE30DL8PHO0F-8EkaRRFSZtoNuyl5f0KlZfm6UsKj-HyTuv/20250702/0uF6/600X494/assets/conditional-expression.gif)

---

## 安装

1. 在 VS Code 中打开扩展面板 (Ctrl+Shift+X)
2. 搜索 "React Transformer"
3. 点击安装即可

## 支持

如果你喜欢这个插件，请给个 ⭐️ 支持一下！

## 许可证

MIT License
