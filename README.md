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
|                                                                                         |

### 快捷键

你可以按 **Shift + Ctrl + R** 快速打开重构菜单。

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

---

## 如何激活

**价格：30 元**

1. 扫码添加微信 **mogician666**
2. 向开发者支付 30 元
3. 把机器码发给开发者
4. 开发者根据机器码发送激活码
5. 搜索"输入激活码"命令，输入激活码
6. 激活成功后，畅享全部高级功能！

## 联系方式

![微信二维码](https://gitee.com/Mogician301/react-transformer/raw/master/wechat-qr.jpg)

## 注意事项

- 激活码只能支持**一台电脑**。
- 更换电脑或重装系统需要另行购买激活码。
