import * as vscode from 'vscode'
import { getSavedActivationCode } from '../paywall/activationCode'

export default async function showActivationCode(context: vscode.ExtensionContext) {
  const activationCode = getSavedActivationCode(context)
  if (!activationCode) {
    vscode.window.showWarningMessage('未找到已保存的激活码')
    return
  }
  const copy = '复制'
  const result = await vscode.window.showInformationMessage(`激活码: ${activationCode}`, copy)
  if (result === copy) {
    await vscode.env.clipboard.writeText(activationCode)
    vscode.window.showInformationMessage('激活码已复制到剪贴板')
  }
}
