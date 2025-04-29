/* eslint-disable eqeqeq */
import * as vscode from "vscode";
import {
  wrapWithDiv,
  SwapWithSibling,
  swapParentChild,
  extract,
  convertToArrowFunction,
} from "./parser";
const createCommand = (
  name: string,
  implementation: (
    sourcecode: string,
    start: number,
    tagName?: string
  ) => string
) => {
  return vscode.commands.registerCommand(
    `react-transformer.${name}`,
    async () => {
      // 获取当前活动的文本编辑器
      const editor = vscode.window.activeTextEditor;
      if (editor == null) {
        vscode.window.showInformationMessage("没有活动的文本编辑器");
        return;
      }

      let tagName = "div";
      if (name === "warp_with_div") {
        const input = await vscode.window.showInputBox({
          prompt: "Enter HTML tag name (default: div)",
          placeHolder: "div",
          validateInput: (value) => {
            if (value && !/^[a-zA-Z][a-zA-Z0-9-]*$/.test(value)) {
              return "Please enter a valid HTML tag name";
            }
            return null;
          },
        });
        if (input !== undefined) {
          tagName = input || "div";
        }
      }

      const sourceCode = editor.document.getText();
      // 获取光标位置
      const position = editor.selection.active;

      // 提取行号和列号
      const document = editor.document;
      const offset = document.offsetAt(position);

      const fullTextRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(document.getText().length)
      );

      const newCode = implementation(sourceCode, offset, tagName);
      editor.edit((builder) => {
        builder.replace(fullTextRange, newCode);
      });

      vscode.commands.executeCommand("editor.action.formatDocument");
    }
  );
};

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(createCommand("warp_with_div", wrapWithDiv));
  context.subscriptions.push(
    createCommand("swap_with_sibiling", SwapWithSibling)
  );
  context.subscriptions.push(
    createCommand("swap_with_parent", swapParentChild)
  );
  context.subscriptions.push(createCommand("extract_as_fc", extract));
  context.subscriptions.push(
    createCommand("convert_to_arrow", convertToArrowFunction)
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
