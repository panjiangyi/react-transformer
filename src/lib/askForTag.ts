import * as vscode from 'vscode'
export const askForTag = async () => {
  const input = await vscode.window.showInputBox({
    prompt: 'Enter HTML tag name (default: Fragment)',
  })
  return input
}
