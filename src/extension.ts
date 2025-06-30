import * as vscode from 'vscode'
import wrapWithDiv from './command/wrapWithDiv'
import swapWithNextSibling from './command/swapWithNextSibling'
import createForwardCommand from './command/createForwardCommand'
import { removeWrapper, removeAll } from './command/remove'
import createAmpersandExpressionCommand from './command/createAmpersandExpression'
import createConditionalExpressionCommand from './command/createConditionalExpression'
import removeChildrenCommand from './command/removeChildren'
import showMachineId from './command/showMachineId'
import './lib/loadEnv'
import { onInstall } from './payment'
import { Selection } from './def'
import { isPaid, promptAndSaveActivationCode } from './paywall/activationCode'
import showActivationCode from './command/showActivationCode'
import showActivationStatus from './command/showActivationStatus'
import { showActivationPlaceholderWebview } from './command/showActivationStatus'

const createCommand = (
  context: vscode.ExtensionContext,
  name: string,
  implementation: (
    context: vscode.ExtensionContext,
    editor: vscode.TextEditor,
    offset: number,
    extra?: Selection,
  ) => Promise<
    | {
        code: string
        originCodeRange: vscode.Range
      }
    | null
    | undefined
  >,
) => {
  return vscode.commands.registerCommand(`react-transformer.${name}`, async () => {
    if (name !== 'warp_it') {
      if (!(await isPaid(context))) {
        vscode.window.showInformationMessage('请购买本插件，以支持作者')
        return
      }
    }
    // 获取当前活动的文本编辑器

    const editor = vscode.window.activeTextEditor
    if (editor == null) {
      vscode.window.showInformationMessage('没有活动的文本编辑器')
      return
    }

    // 获取光标位置和选区
    const position = editor.selection.active
    const selection = editor.selection
    const document = editor.document
    const offset = document.offsetAt(position)

    let extra = undefined
    if (!selection.isEmpty) {
      const selectedText = document.getText(selection)
      const selectionStartOffset = document.offsetAt(selection.start)
      const selectionEndOffset = document.offsetAt(selection.end)
      extra = {
        selectedText,
        selectionStartOffset,
        selectionEndOffset,
      }
    }

    const result = await implementation(context, editor, offset, extra)
    if (result == null) {
      return
    }
    const { code, originCodeRange } = result
    editor.edit(builder => {
      builder.replace(originCodeRange, code)
    })
  })
}

function showRefactorMenu() {
  const options = [
    { label: '用新标签包裹（默认：Fragment）', command: 'react-transformer.warp_it' },
    { label: '移除包裹标签', command: 'react-transformer.remove_wrapper' },
    { label: '与下一个兄弟节点交换', command: 'react-transformer.swap_with_next_sibling' },
    { label: '创建 forward ref', command: 'react-transformer.create_forward' },
    { label: '创建 & 表达式', command: 'react-transformer.create_ampersand_expression' },
    { label: '创建条件表达式', command: 'react-transformer.create_conditional_expression' },
  ]

  vscode.window
    .showQuickPick(options, {
      placeHolder: '选择一个重构操作',
    })
    .then(selected => {
      if (selected) {
        vscode.commands.executeCommand(selected.command)
      }
    })
}

class RefactorCodeActionProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.CodeAction[]> {
    const actions: vscode.CodeAction[] = []

    const refactorings = [
      { title: '用新标签包裹（默认：Fragment）', command: 'react-transformer.warp_it' },
      { title: '移除包裹标签', command: 'react-transformer.remove_wrapper' },
      { title: '移除所有内容', command: 'react-transformer.remove_all' },
      { title: '移除所有子节点', command: 'react-transformer.remove_children' },
      { title: '与下一个兄弟节点交换', command: 'react-transformer.swap_with_next_sibling' },
      { title: '创建 forward ref', command: 'react-transformer.create_forward' },
      { title: '创建 & 表达式', command: 'react-transformer.create_ampersand_expression' },
      { title: '创建条件表达式', command: 'react-transformer.create_conditional_expression' },
    ]

    for (const refactor of refactorings) {
      const action = new vscode.CodeAction(refactor.title, vscode.CodeActionKind.Refactor)
      action.command = {
        title: refactor.title,
        command: refactor.command,
      }
      actions.push(action)
    }
    return actions
  }
}

let activationStatusBarItem: vscode.StatusBarItem | undefined

async function updateActivationStatusBar(context: vscode.ExtensionContext) {
  if (!activationStatusBarItem) return
  const paid = await isPaid(context)
  if (paid) {
    activationStatusBarItem.text = '$(verified) 已激活'
    activationStatusBarItem.tooltip = 'React Transformer 已激活'
    activationStatusBarItem.command = undefined
    activationStatusBarItem.hide()
  } else {
    activationStatusBarItem.text = '$(error) 未激活React Transformer'
    activationStatusBarItem.tooltip = '点击查看激活信息'
    activationStatusBarItem.command = 'react-transformer.show_activation_placeholder_webview'
  }
  activationStatusBarItem.show()
}

function initActivationStatusBar(context: vscode.ExtensionContext) {
  activationStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99)
  context.subscriptions.push(activationStatusBarItem)
  updateActivationStatusBar(context)
  // Optionally, poll or listen for activation changes
  // Here, we poll every 5 seconds for demo
  const timer = setInterval(() => updateActivationStatusBar(context), 5000)
  context.subscriptions.push({ dispose: () => clearInterval(timer) })
}

export function activate(context: vscode.ExtensionContext) {
  onInstall(context, () => {
    vscode.window.showInformationMessage('感谢安装本插件！')
  })
  const _createCommand = createCommand.bind(null, context)
  context.subscriptions.push(_createCommand('remove_wrapper', removeWrapper))
  context.subscriptions.push(_createCommand('remove_all', removeAll))
  context.subscriptions.push(_createCommand('warp_it', wrapWithDiv))
  context.subscriptions.push(_createCommand('swap_with_next_sibling', swapWithNextSibling))
  context.subscriptions.push(_createCommand('create_forward', createForwardCommand))
  context.subscriptions.push(_createCommand('create_ampersand_expression', createAmpersandExpressionCommand))
  context.subscriptions.push(_createCommand('create_conditional_expression', createConditionalExpressionCommand))
  context.subscriptions.push(_createCommand('remove_children', removeChildrenCommand))
  context.subscriptions.push(vscode.commands.registerCommand('react-transformer.showRefactorMenu', showRefactorMenu))
  context.subscriptions.push(vscode.commands.registerCommand('react-transformer.show_machine_id', showMachineId))
  context.subscriptions.push(
    vscode.commands.registerCommand('react-transformer.input_activation_code', () =>
      promptAndSaveActivationCode(context),
    ),
  )
  context.subscriptions.push(
    vscode.commands.registerCommand('react-transformer.show_activation_code', () => showActivationCode(context)),
  )
  context.subscriptions.push(
    vscode.commands.registerCommand('react-transformer.show_activation_status', () => showActivationStatus(context)),
  )
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      ['javascript', 'javascriptreact', 'typescript', 'typescriptreact'],
      new RefactorCodeActionProvider(),
      {
        providedCodeActionKinds: [vscode.CodeActionKind.Refactor],
      },
    ),
  )
  initActivationStatusBar(context)
  context.subscriptions.push(
    vscode.commands.registerCommand('react-transformer.show_activation_placeholder_webview', () =>
      showActivationPlaceholderWebview(context),
    ),
  )
}

// This method is called when your extension is deactivated
export function deactivate() {
  vscode.window.showInformationMessage('React Transformer is deactivated')
}
