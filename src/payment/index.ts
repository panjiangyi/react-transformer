import * as vscode from 'vscode'

const __key__ = 'react-transformer-installed'
export function onInstall(context: vscode.ExtensionContext, cb: () => void) {
  const isInitialized = context.globalState.get<boolean>(__key__)

  if (!isInitialized) {
    // 只执行一次
    cb()

    context.globalState.update(__key__, true)
  }
}
