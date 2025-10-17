# React Transformer - VSCode 扩展开发规范

## 项目概述

React Transformer 是一个强大的 VSCode 扩展，专门用于高效重构和转换 React (JSX/TSX) 代码。该扩展提供一键式重构、包装、交换和转换 JSX 元素的功能。

### 核心功能
- **JSX 包装**: 使用任意标签包装 JSX 元素（默认 Fragment）
- **兄弟节点交换**: 与下一个兄弟 JSX 元素交换位置
- **forwardRef 创建**: 创建 forwardRef 包装器
- **JSX 移除**: 移除 JSX 元素并提升其子元素
- **条件表达式转换**: 将 JSX 转换为 && 表达式或三元表达式

## 技术栈

- **语言**: TypeScript
- **框架**: VSCode Extension API
- **编译器**: TypeScript Compiler API
- **构建工具**: esbuild
- **包管理**: npm/pnpm
- **代码质量**: ESLint + Prettier

## 项目结构

```
react-transformer/
├── src/                          # 源代码目录
│   ├── command/                  # 命令实现
│   │   ├── wrapWithDiv.ts       # 包装标签命令
│   │   ├── swapWithNextSibling.ts # 交换兄弟节点命令
│   │   ├── createForwardCommand.ts # 创建 forwardRef 命令
│   │   ├── remove.ts            # 移除相关命令
│   │   ├── createAmpersandExpression.ts # 创建 && 表达式
│   │   ├── createConditionalExpression.ts # 创建条件表达式
│   │   └── removeChildren.ts    # 移除子节点命令
│   ├── lib/                     # 核心工具库
│   │   ├── findAndOperateOnNode.ts # 节点查找和操作
│   │   ├── transformSourceFileWithVisitor.ts # 源文件转换
│   │   ├── visitor.ts           # 访问者模式实现
│   │   ├── getSourceFile.ts     # 获取源文件
│   │   ├── printNode.ts         # 节点打印
│   │   ├── isElement.ts         # 元素判断
│   │   └── wrap-creator.ts      # 包装创建器
│   ├── payment/                 # 付费相关
│   ├── extension.ts             # 扩展入口文件
│   └── def.ts                   # 类型定义
├── assets/                      # 资源文件
├── package.json                 # 项目配置
├── tsconfig.json               # TypeScript 配置
└── esbuild.js                  # 构建配置
```

## 核心架构模式

### 1. 命令模式 (Command Pattern)
每个功能都实现为独立的命令，通过统一的命令工厂创建：

```typescript
// 命令接口定义
type CommandImplementation = (
  context: vscode.ExtensionContext,
  editor: vscode.TextEditor,
  offset: number,
  extra?: Selection,
) => Promise<{
  code: string
  originCodeRange: vscode.Range
} | null | undefined>

// 命令工厂
const createCommand = (
  context: vscode.ExtensionContext,
  name: string,
  implementation: CommandImplementation,
) => {
  return vscode.commands.registerCommand(`react-transformer.${name}`, async () => {
    // 统一的命令执行逻辑
  })
}
```

### 2. 访问者模式 (Visitor Pattern)
使用访问者模式遍历 TypeScript AST：

```typescript
// 访问者函数
function visitor(
  parent: ts.Node,
  node: ts.Node,
  start: number,
  callback: (parent: ts.Node, node: ts.Node) => void
) {
  node.forEachChild((child) => {
    visitor(node, child, start, callback);
  });
  if (start >= node.pos && start <= node.end) {
    callback(parent, node);
  }
}
```

### 3. 高阶函数模式
`findAndOperateOnNode` 是一个高阶函数，用于查找和操作 AST 节点：

```typescript
async function findAndOperateOnNode<TParent, TMatch, TResult>(
  editor: vscode.TextEditor,
  start: number,
  match: TMatch,
  onFound: (parent: TParent, node: ts.Node) => TResult,
): Promise<TResult>
```

## 开发规范

### 1. 代码组织
- **命令实现**: 所有命令实现放在 `src/command/` 目录
- **工具函数**: 通用工具函数放在 `src/lib/` 目录
- **类型定义**: 类型定义放在 `src/def.ts` 文件
- **扩展入口**: 主要逻辑在 `src/extension.ts`

### 2. 命名约定
- **文件名**: 使用 camelCase，如 `wrapWithDiv.ts`
- **函数名**: 使用 camelCase，如 `createCommand`
- **类型名**: 使用 PascalCase，如 `Selection`
- **常量**: 使用 UPPER_SNAKE_CASE

### 3. TypeScript 规范
- 启用严格模式 (`"strict": true`)
- 使用 ES2022 目标和库
- 优先使用类型推断，必要时显式声明类型
- 使用泛型提高代码复用性

### 4. 错误处理
- 使用 `try-catch` 处理异步操作
- 提供有意义的错误消息
- 在找不到节点时抛出明确的错误

```typescript
if (result == null) throw new Error('No node found')
```

### 5. VSCode 集成
- 支持多种语言：`javascript`, `javascriptreact`, `typescript`, `typescriptreact`
- 提供右键菜单集成
- 支持命令面板访问
- 实现 CodeAction Provider

## 构建和部署

### 开发环境
```bash
# 安装依赖
npm install

# 开发模式（监听文件变化）
npm run watch

# 类型检查
npm run watch:tsc
```

### 生产构建
```bash
# 构建扩展包
npm run package

# 发布到市场
npm run publish
```

### 构建配置
- 使用 esbuild 进行快速构建
- 生产模式启用代码压缩
- 支持 source map 用于调试

## 测试策略

### 单元测试
- 使用 VSCode 测试框架
- 测试核心工具函数
- 模拟 VSCode API

### 集成测试
- 测试完整的命令执行流程
- 验证 AST 转换结果
- 测试用户交互场景

## 性能优化

### AST 处理优化
- 使用访问者模式减少遍历次数
- 缓存源文件解析结果
- 延迟加载非必要模块

### 内存管理
- 及时释放大型 AST 对象
- 避免循环引用
- 使用弱引用处理缓存

## 扩展性设计

### 新命令添加
1. 在 `src/command/` 创建命令实现文件
2. 在 `src/extension.ts` 注册命令
3. 在 `package.json` 添加命令配置
4. 更新菜单和快捷键配置

### 新语言支持
1. 在 `package.json` 的 `activationEvents` 添加语言
2. 在 CodeAction Provider 中添加语言支持
3. 测试新语言的 AST 解析

## 调试指南

### 开发调试
- 使用 VSCode 的扩展开发主机
- 启用 source map 进行断点调试
- 使用 `console.log` 输出调试信息

### 生产调试
- 检查扩展激活状态
- 查看 VSCode 开发者工具控制台
- 收集用户反馈和错误报告

## 最佳实践

### 1. 代码质量
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 编写清晰的注释和文档

### 2. 用户体验
- 提供直观的命令名称
- 实现快速响应的操作
- 给出有用的错误提示

### 3. 兼容性
- 支持多个 VSCode 版本
- 兼容不同的 TypeScript 版本
- 处理各种 JSX 语法变体

### 4. 安全性
- 验证用户输入
- 安全地处理文件操作
- 避免执行不安全的代码

## 贡献指南

### 开发流程
1. Fork 项目仓库
2. 创建功能分支
3. 实现功能并添加测试
4. 提交 Pull Request
5. 代码审查和合并

### 提交规范
- 使用语义化提交消息
- 包含功能描述和影响范围
- 关联相关的 Issue

### 文档更新
- 更新 README.md
- 添加新功能的使用示例
- 更新 CHANGELOG.md

---

*此文档定义了 React Transformer 项目的开发规范和最佳实践，旨在确保代码质量和项目的可维护性。*