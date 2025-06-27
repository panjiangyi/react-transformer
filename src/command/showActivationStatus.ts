import * as vscode from 'vscode'
import { isPaid } from '../paywall/activationCode'

export default async function showActivationStatus(context: vscode.ExtensionContext) {
  const result = await isPaid(context)
  if (result) {
    vscode.window.showInformationMessage('激活码有效，感谢您的支持！')
  } else {
    vscode.window.showWarningMessage('激活码无效或未激活')
  }
}
