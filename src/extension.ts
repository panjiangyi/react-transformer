import * as vscode from 'vscode'
import wrapWithDiv from './command/wrapWithDiv'
import swapWithNextSibling from './command/swapWithNextSibling'
import createForwardCommand from './command/createForwardCommand'
import { removeWrapper, removeAll } from './command/remove'
import createAmpersandExpressionCommand from './command/createAmpersandExpression'
import createConditionalExpressionCommand from './command/createConditionalExpression'
import removeChildrenCommand from './command/removeChildren'
import './lib/loadEnv'
import { onInstall } from './payment'
import { Selection } from './def'

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
    // Get the currently active text editor

    const editor = vscode.window.activeTextEditor
    if (editor == null) {
      vscode.window.showInformationMessage('No active text editor')
      return
    }

    // Get cursor position and selection
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
    { label: 'Wrap with new tag (default: Fragment)', command: 'react-transformer.warp_it' },
    { label: 'Remove wrapper tag', command: 'react-transformer.remove_wrapper' },
    { label: 'Swap with next sibling', command: 'react-transformer.swap_with_next_sibling' },
    { label: 'Create forward ref', command: 'react-transformer.create_forward' },
    { label: 'Create & expression', command: 'react-transformer.create_ampersand_expression' },
    { label: 'Create conditional expression', command: 'react-transformer.create_conditional_expression' },
  ]

  vscode.window
    .showQuickPick(options, {
      placeHolder: 'Select a refactoring operation',
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
      { title: 'Remove wrapper tag', command: 'react-transformer.remove_wrapper' },
      { title: 'Remove all content', command: 'react-transformer.remove_all' },
      { title: 'Remove all children', command: 'react-transformer.remove_children' },
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
  onInstall(context, () => {
    vscode.window.showInformationMessage('Thank you for installing this extension!')
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
export function deactivate() {
  vscode.window.showInformationMessage('React Transformer is deactivated')
}
