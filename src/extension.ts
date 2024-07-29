// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { start } from "./parser";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "react-transformer" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "react-transformer.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showWarningMessage("Hello World from react-transformer!");
    }
  );

  context.subscriptions.push(disposable);

  const transformCommand = vscode.commands.registerCommand(
    "react-transformer.transformToOptionalChain",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const selectedText = editor.document.getText(editor.selection);

        editor.edit((builder) => {
          builder.replace(editor.selection, selectedText.toUpperCase());
        });
        vscode.window.showInformationMessage("转换成功！");
      }
    }
  );
  let getCursorPosition = vscode.commands.registerCommand(
    "react-transformer.getCursorPosition",
    () => {
      // 获取当前活动的文本编辑器
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const sourceCode = editor.document.getText();
        // 获取光标位置
        const position = editor.selection.active;

        // 提取行号和列号
        const line = position.line;
        const column = position.character;
        const document = editor.document;
        const offset = document.offsetAt(position);

        const fullTextRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(document.getText().length)
        );

        const newCode = start(sourceCode, offset);
        editor.edit((builder) => {
          builder.replace(fullTextRange, newCode);
        });

        // 输出行号和列号
        vscode.commands.executeCommand("editor.action.formatDocument");

        vscode.window.showInformationMessage(
          `行号: ${line + 1}, 列号: ${column + 1},offset:${offset}`
        );
      } else {
        vscode.window.showInformationMessage("没有活动的文本编辑器");
      }
    }
  );

  context.subscriptions.push(getCursorPosition);
  context.subscriptions.push(disposable);

  context.subscriptions.push(transformCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
