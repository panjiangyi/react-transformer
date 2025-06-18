import * as vscode from 'vscode'

// const TRIAL_PERIOD_MS = 7 * 24 * 60 * 60 * 1000 // 1 week
const TRIAL_PERIOD_MS = 1
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

export { setTrialStartTime, isInTrial }
