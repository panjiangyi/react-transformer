import * as vscode from 'vscode'
export const askForTag = async () => {
  const input = await vscode.window.showInputBox({
    prompt: '请输入 HTML 标签名（默认：Fragment）',
    validateInput: value => {
      if (value && !/^[a-zA-Z][a-zA-Z0-9-]*$/.test(value)) {
        return '请输入合法的 HTML 标签名'
      }
      return null
    },
  })
  return input
}
