import * as vscode from 'vscode'
export const askForTag = async () => {
  const input = await vscode.window.showInputBox({
    prompt: '请输入 HTML 标签名（默认：Fragment）',
  })
  return input
}
