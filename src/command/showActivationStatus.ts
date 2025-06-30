import * as vscode from 'vscode'
import { isPaid } from '../paywall/activationCode'
import * as fs from 'fs'
import * as path from 'path'
import getMachineCode from '../paywall/machineId'
export default async function showActivationStatus(context: vscode.ExtensionContext) {
  const result = await isPaid(context)
  if (result) {
    vscode.window.showInformationMessage('激活码有效，感谢您的支持！')
  } else {
    vscode.window.showWarningMessage('激活码无效或未激活')
  }
}

export async function showActivationPlaceholderWebview(context: vscode.ExtensionContext) {
  const machineId = await getMachineCode()
  const panel = vscode.window.createWebviewPanel('activationPlaceholder', '激活状态', vscode.ViewColumn.One, {})
  const htmlPath = path.join(context.extensionPath, 'assets', 'activation.html')
  let html = fs.readFileSync(htmlPath, 'utf-8')
  // 处理图片等静态资源路径
  const wechatQrPath = panel.webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, 'assets', 'wechat-qr.jpg')),
  )
  html = html.replace('wechat-qr.jpg', wechatQrPath.toString()).replace('{{__machince__code__}}', machineId)
  panel.webview.html = html
}
