import * as vscode from 'vscode'
import { isPaid } from '../paywall/activationCode'

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
    activationStatusBarItem.show()
  }
}

export function initActivationStatusBar(context: vscode.ExtensionContext) {
  activationStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99)
  context.subscriptions.push(activationStatusBarItem)
  updateActivationStatusBar(context)
  // Optionally, poll or listen for activation changes
  // Here, we poll every 5 seconds for demo
  const timer = setInterval(() => updateActivationStatusBar(context), 5000)
  context.subscriptions.push({ dispose: () => clearInterval(timer) })
}
