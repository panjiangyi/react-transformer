import * as vscode from "vscode";
import wrapWithDiv from "./command/wrapWithDiv";
import swapWithNextSibling from "./command/swapWithNextSibling";
import createForwardCommand from "./command/createForwardCommand";
import remove from "./command/remove";
const createCommand = (
  name: string,
  implementation: (
    editor: vscode.TextEditor,
    offset: number
  ) => Promise<{
    code: string;
    originCodeRange: vscode.Range;
  }>
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

      const { code, originCodeRange } = await implementation(editor, offset);
      editor.edit((builder) => {
        builder.replace(originCodeRange, code);
      });


      vscode.commands.executeCommand("editor.action.formatDocument");
    }
  );
};

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(createCommand("remove", remove));
  context.subscriptions.push(createCommand("warp_with_div", wrapWithDiv));
  context.subscriptions.push(
    createCommand("swap_with_next_sibling", swapWithNextSibling)
  );
  context.subscriptions.push(
    createCommand("create_forward", createForwardCommand)
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
