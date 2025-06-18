import * as vscode from 'vscode'

export function onInstall(context: vscode.ExtensionContext, cb: () => void) {
  const isInitialized = context.globalState.get<boolean>('initialized')

  if (!isInitialized) {
    // 只执行一次
    cb()

    context.globalState.update('initialized', true)
  }
}
