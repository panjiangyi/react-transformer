import * as vscode from "vscode";
import ts from "typescript";
import { createWrap } from "./lib/wrap-creator";
const getProgramFronSouceCode = (code: string) => {
  // Create a virtual file system to hold our code
  const compilerHost = ts.createCompilerHost({});
  const sourceFile = ts.createSourceFile(
    "temp.tsx",
    code,
    ts.ScriptTarget.Latest
  );

  // Override host to serve our virtual file
  compilerHost.getSourceFile = (fileName) => {
    if (fileName === "temp.tsx") {
      return sourceFile;
    }
    return undefined;
  };

  // Create program with virtual file system
  const program = ts.createProgram(
    ["temp.tsx"],
    {
      allowJs: true,
      checkJs: false,
      jsx: ts.JsxEmit.Preserve,
    },
    compilerHost
  );
  return program;
};

/**
 * Takes an arrow function and returns a function expression
 * @param {ts.ArrowFunction} arrowFunction
 * @returns {ts.FunctionExpression}
 */
function transformArrowFunction(arrowFunction: ts.ArrowFunction) {
  return ts.factory.createFunctionExpression(
    arrowFunction.modifiers,
    arrowFunction.asteriskToken,
    arrowFunction.name,
    arrowFunction.typeParameters,
    arrowFunction.parameters,
    arrowFunction.type,
    // @ts-ignore
    arrowFunction.body
  );
}
ts.SyntaxKind;
function visitor(
  parent: ts.Node,
  node: ts.Node,
  start: number,
  callback: (parent: ts.Node, node: ts.Node) => void
) {
  if (start >= node.pos && start <= node.end) {
    callback(parent, node);
  }
  node.forEachChild((child) => {
    visitor(node, child, start, callback);
  });
}

export const wrapWithDiv = (editor: vscode.TextEditor, start: number) => {
  const program = ts.createProgram([editor.document.fileName], {
    module: ts.ModuleKind.ESNext,
  });

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  let sourcecode = editor.document.getText();
  for (const rootFileName of program.getRootFileNames()) {
    const sourceFile = program.getSourceFile(rootFileName);
    if (sourceFile == null) {
      continue;
    }

    if (sourceFile && !sourceFile.isDeclarationFile) {
      const callback = (parent: ts.Node, node: ts.Node) => {
        if (ts.isJsxElement(node)) {
          // @ts-ignore
          parent.expression = createWrap("div", [node]);
        }
      };
      sourceFile.forEachChild((node) => {
        visitor(sourceFile, node, start, callback);
      });
    }

    sourcecode = printer.printNode(
      ts.EmitHint.Unspecified,
      sourceFile,
      sourceFile
    );
  }
  vscode.window.showInformationMessage("wrapWithDiv");
  return sourcecode;
};
