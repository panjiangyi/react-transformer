import * as vscode from "vscode";
export const askForTag = async () => {
  const input = await vscode.window.showInputBox({
    prompt: "Enter HTML tag name (default: Fragment)",
    validateInput: (value) => {
      if (value && !/^[a-zA-Z][a-zA-Z0-9-]*$/.test(value)) {
        return "Please enter a valid HTML tag name";
      }
      return null;
    },
  });
  return input 
};
