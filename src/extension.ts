import * as vscode from 'vscode'
import wrapWithDiv from './command/wrapWithDiv'
import swapWithNextSibling from './command/swapWithNextSibling'
import createForwardCommand from './command/createForwardCommand'
import remove from './command/remove'
import createAmpersandExpressionCommand from './command/createAmpersandExpression'
import createConditionalExpressionCommand from './command/createConditionalExpression'
const createCommand = (
  name: string,
  implementation: (
    editor: vscode.TextEditor,
    offset: number,
  ) => Promise<{
    code: string
    originCodeRange: vscode.Range
  }>,
) => {
  return vscode.commands.registerCommand(`react-transformer.${name}`, async () => {
    // 获取当前活动的文本编辑器
    const editor = vscode.window.activeTextEditor
    if (editor == null) {
      vscode.window.showInformationMessage('没有活动的文本编辑器')
      return
    }

    // const sourceCode = editor.document.getText();
    // 获取光标位置
    const position = editor.selection.active

    // 提取行号和列号
    const document = editor.document
    const offset = document.offsetAt(position)

    const fullTextRange = new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length))

    const { code, originCodeRange } = await implementation(editor, offset)
    editor.edit(builder => {
      builder.replace(originCodeRange, code)
    })

    vscode.commands.executeCommand('editor.action.formatDocument')
  })
}

function showRefactorMenu() {
  const options = [
    { label: 'Wrap with <div>', command: 'react-transformer.warp_it' },
    { label: 'Remove', command: 'react-transformer.remove' },
    { label: 'Swap with next sibling', command: 'react-transformer.swap_with_next_sibling' },
    { label: 'Create forward ref', command: 'react-transformer.create_forward' },
    { label: 'Create & expression', command: 'react-transformer.create_ampersand_expression' },
    { label: 'Create conditional expression', command: 'react-transformer.create_conditional_expression' },
  ]

  vscode.window
    .showQuickPick(options, {
      placeHolder: 'Select a refactoring',
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
      { title: 'Wrap with new tag (default: Fragment)', command: 'react-transformer.warp_it' },
      { title: 'Remove', command: 'react-transformer.remove' },
      { title: 'Swap with next sibling', command: 'react-transformer.swap_with_next_sibling' },
      { title: 'Create forward ref', command: 'react-transformer.create_forward' },
      { title: 'Create & expression', command: 'react-transformer.create_ampersand_expression' },
      { title: 'Create conditional expression', command: 'react-transformer.create_conditional_expression' },
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

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(createCommand('remove', remove))
  context.subscriptions.push(createCommand('warp_it', wrapWithDiv))
  context.subscriptions.push(createCommand('swap_with_next_sibling', swapWithNextSibling))
  context.subscriptions.push(createCommand('create_forward', createForwardCommand))
  context.subscriptions.push(createCommand('create_ampersand_expression', createAmpersandExpressionCommand))
  context.subscriptions.push(createCommand('create_conditional_expression', createConditionalExpressionCommand))
  context.subscriptions.push(vscode.commands.registerCommand('react-transformer.showRefactorMenu', showRefactorMenu))
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      ['javascript', 'javascriptreact', 'typescript', 'typescriptreact'],
      new RefactorCodeActionProvider(),
      {
        providedCodeActionKinds: [vscode.CodeActionKind.Refactor],
      },
    ),
  )
}

// This method is called when your extension is deactivated
export function deactivate() {}
