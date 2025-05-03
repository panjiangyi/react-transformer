/* eslint-disable eqeqeq */
import * as vscode from "vscode";
import {
  wrapWithDiv,
  SwapWithSibling,
  swapParentChild,
  extract,
  convertToArrowFunction,
} from "./parser";
import getTypedParameters from "./getTypedParameters";

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

const createGetTypedParametersCommand = () => {
  return vscode.commands.registerCommand(
    "react-transformer.get_typed_parameters",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No active editor");
        return;
      }
      const sourceCode = editor.document.getText();
      const position = editor.selection.active;
      const document = editor.document;
      const offset = document.offsetAt(position);
      try {
        const result = getTypedParameters(sourceCode, offset);
        vscode.window.showInformationMessage(
          "Typed Parameters: " + JSON.stringify(result, null, 2)
        );
      } catch (e) {
        vscode.window.showErrorMessage("Error: " + (e as Error).message);
      }
    }
  );
};

const createShowCommandsCommand = () => {
  return vscode.commands.registerCommand(
    "react-transformer.showCommands",
    async () => {
      const commands = [
        {
          label: "Wrap with div",
          command: "react-transformer.warp_with_div",
          description:
            "Wrap the selected JSX element with a div or custom element",
        },
        {
          label: "Swap with Parent",
          command: "react-transformer.swap_with_parent",
          description: "Swap the selected JSX element with its parent",
        },
        {
          label: "Swap with Sibling",
          command: "react-transformer.swap_with_sibiling",
          description: "Swap the selected JSX element with its next sibling",
        },
        {
          label: "Extract as Function Component",
          command: "react-transformer.extract_as_fc",
          description:
            "Extract the selected JSX element as a new function component",
        },
        {
          label: "Convert to Arrow Function",
          command: "react-transformer.convert_to_arrow",
          description: "Convert the selected function to an arrow function",
        },
        {
          label: "Get Typed Parameters",
          command: "react-transformer.get_typed_parameters",
          description:
            "Get type information for variables used in the selected JSX",
        },
      ];

      const selected = await vscode.window.showQuickPick(commands, {
        placeHolder: "Select a React Transformer command",
        matchOnDescription: true,
      });

      if (selected) {
        await vscode.commands.executeCommand(selected.command);
      }
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
  context.subscriptions.push(createGetTypedParametersCommand());
  context.subscriptions.push(createShowCommandsCommand());
}

// This method is called when your extension is deactivated
export function deactivate() {}
