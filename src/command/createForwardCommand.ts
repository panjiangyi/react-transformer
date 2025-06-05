import * as vscode from "vscode";
import ts from "typescript";
import { createForward } from "../lib/create-forward";
import { createImportForwardRef } from "../lib/create-import-forwardRef";
import transformSourceFileWithVisitor from "../lib/transformSourceFileWithVisitor";

const createForwardCommand = async (
  editor: vscode.TextEditor,
  start: number
) => {
  const getCallback = () => {
    let found = false;
    return (parent: ts.Node, node: ts.Node) => {
      if (found) {
        return;
      }
      if (ts.isVariableDeclaration(node)) {
        found = true;
        // @ts-ignore
        const FCType = node.type?.typeArguments?.[0];
        const newNode = createForward(FCType, node.initializer);
        // @ts-ignore
        node.type = undefined;
        // @ts-ignore
        node.initializer = newNode;
      }
    };
  };
  const preVisitMutateSourceFile = (sourceFile: ts.SourceFile) => {
    const importForwardRef = createImportForwardRef();
    const [firstStatement, ...resetStates] = sourceFile.statements;
    if (ts.isExpressionStatement(firstStatement)) {
      // @ts-ignore
      sourceFile.statements = [
        firstStatement,
        importForwardRef,
        ...resetStates,
      ];
    } else {
      // @ts-ignore
      sourceFile.statements = [importForwardRef, ...sourceFile.statements];
    }
  };
  return transformSourceFileWithVisitor(
    editor,
    start,
    getCallback,
    preVisitMutateSourceFile,
    "wrapWithDiv"
  );
};

export default createForwardCommand;
