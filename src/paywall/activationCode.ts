import * as vscode from 'vscode'
import verifyActivationCode from './verifyActivationCode'

const ACTIVATION_CODE_KEY = 'react-transformer-activation-code'

/**
 * Prompts the user to enter their activation code and saves it to globalState.
 * @param context The extension context
 */
export async function promptAndSaveActivationCode(context: vscode.ExtensionContext) {
  const activationCode = await vscode.window.showInputBox({
    prompt: '请输入您的激活码',
    placeHolder: '激活码',
    ignoreFocusOut: true,
    password: false,
  })

  if (activationCode) {
    await context.globalState.update(ACTIVATION_CODE_KEY, activationCode)
    const result = await verifyActivationCode(activationCode)
    if (result && result.success) {
      vscode.window.showInformationMessage('激活码已保存，且有效，感谢您的支持！')
    } else {
      vscode.window.showWarningMessage('激活码已保存，但无效或已过期')
    }
  } else {
    vscode.window.showWarningMessage('未输入激活码，未做任何更改')
  }
}

/**
 * 获取已保存的激活码
 */
export function getSavedActivationCode(context: vscode.ExtensionContext): string | undefined {
  return context.globalState.get<string>(ACTIVATION_CODE_KEY)
}

export async function isPaid(context: vscode.ExtensionContext) {
  const activationCode = getSavedActivationCode(context)
  if (!activationCode) {
    return false
  }

  return (await verifyActivationCode(activationCode)).success
}
