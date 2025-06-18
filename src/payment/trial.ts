import * as vscode from 'vscode'

const TRIAL_PERIOD_MS = 7 * 24 * 60 * 60 * 1000 // 1 week
// const TRIAL_PERIOD_MS = 1
const setTrialStartTime = (context: vscode.ExtensionContext) => {
  const trialStartTime = new Date().toISOString()
  context.globalState.update('trialStartTime', trialStartTime)
}

const isInTrial = (context: vscode.ExtensionContext) => {
  const trialStartTime = context.globalState.get<string>('trialStartTime')
  if (!trialStartTime) {
    return false
  }
  return new Date(trialStartTime) > new Date(Date.now() - TRIAL_PERIOD_MS)
}

const getTrialRemainingTime = (context: vscode.ExtensionContext) => {
  const trialStartTime = context.globalState.get<string>('trialStartTime')
  console.log('trialStartTime', trialStartTime)
  if (!trialStartTime) {
    return 0
  }
  const start = new Date(trialStartTime).getTime()
  const now = Date.now()
  console.log('start', start, now)
  return Math.max(0, start + TRIAL_PERIOD_MS - now)
}

let trialStatusBarItem: vscode.StatusBarItem | undefined

function updateTrialStatusBar(context: vscode.ExtensionContext) {
  if (!trialStatusBarItem) return
  const ms = getTrialRemainingTime(context)
  console.log('ms', ms)
  if (ms > 0) {
    const totalSeconds = Math.floor(ms / 1000)
    const days = Math.floor(totalSeconds / (24 * 60 * 60))
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
    const seconds = totalSeconds % 60
    trialStatusBarItem.text = `$(clock) 试用剩余: ${days}天${hours}小时${minutes}分${seconds}秒`
    trialStatusBarItem.tooltip = 'React Transformer 试用期剩余时间'
  } else {
    trialStatusBarItem.text = '$(clock) 试用已结束'
    trialStatusBarItem.tooltip = 'React Transformer 试用期已结束'
  }
  trialStatusBarItem.show()
}
function initTrialStatusBar(context: vscode.ExtensionContext) {
  trialStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100)
  context.subscriptions.push(trialStatusBarItem)
  updateTrialStatusBar(context)
  const trialStatusBarTimer = setInterval(() => updateTrialStatusBar(context), 1000)
  context.subscriptions.push({ dispose: () => trialStatusBarTimer && clearInterval(trialStatusBarTimer) })
}
export { setTrialStartTime, isInTrial, getTrialRemainingTime, initTrialStatusBar }
