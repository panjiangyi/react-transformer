import * as vscode from "vscode";
import { wrapWithDiv } from "./parser";
import getTypedParameters from "./getTypedParameters";

const createCommand = (
  name: string,
  implementation: (
    editor: vscode.TextEditor,
    offset: number
  ) => Promise<string> | string
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

      // const sourceCode = editor.document.getText();
      // 获取光标位置
      const position = editor.selection.active;

      // 提取行号和列号
      const document = editor.document;
      const offset = document.offsetAt(position);

      const fullTextRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(document.getText().length)
      );

      const newCode = await implementation(editor, offset);
      editor.edit((builder) => {
        builder.replace(fullTextRange, newCode);
      });

      vscode.commands.executeCommand("editor.action.formatDocument");
    }
  );
};

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(createCommand("warp_with_div", wrapWithDiv));
}

// This method is called when your extension is deactivated
export function deactivate() {}
