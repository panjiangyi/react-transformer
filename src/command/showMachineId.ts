import * as vscode from 'vscode'
import getMachineCode from '../paywall/machineId'

export default async function showMachineId() {
  const machineId = await getMachineCode()
  const copy = '复制'
  const result = await vscode.window.showInformationMessage(`本机机器码: ${machineId}`, copy)
  if (result === copy) {
    await vscode.env.clipboard.writeText(machineId)
    vscode.window.showInformationMessage('机器码已复制到剪贴板')
  }
}
