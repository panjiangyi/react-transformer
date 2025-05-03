import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import ts from "typescript";
import { getVariableTypeFromSource } from "./getVariableType";

const getTypescriptTypeChecker = (code: string) => {
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

  return program.getTypeChecker();
};

export const getTypedParameters = (sourcecode: string, start: number) => {
  // Parse the code and get the type checker
  const typeChecker = getTypescriptTypeChecker(sourcecode);
  const ast = parse(sourcecode, {
    sourceType: "module",
    allowImportExportEverywhere: true,
    plugins: ["jsx", "typescript"],
  });

  let result: Record<string, string> = {};
  let found = false;

  traverse(ast, {
    JSXElement(path) {
      const _start = path.node.openingElement.start ?? Infinity;
      const _end = path.node.openingElement.end ?? -Infinity;
      if (start < _start || start > _end) {
        return;
      }
      if (found) {
        return;
      }
      found = true;

      // Collect all identifiers in this JSX node and its children
      const usedVariables = new Set<string>();

      path.traverse({
        Identifier(innerPath) {
          // Exclude JSX tag names and attribute names
          if (
            innerPath.parentPath &&
            (t.isJSXOpeningElement(innerPath.parent) ||
              t.isJSXClosingElement(innerPath.parent) ||
              t.isJSXAttribute(innerPath.parent))
          ) {
            return;
          }
          usedVariables.add(innerPath.node.name);
        },
      });
      const variableTypes = getVariableTypeFromSource(
        sourcecode,
        Array.from(usedVariables)
      );
      console.log("variableTypes", variableTypes, usedVariables);
      // Use TypeScript to get the type of each variable
      // We'll use a TypeScript SourceFile and try to find the variable in the scope
      const file = ts.createSourceFile(
        "temp.tsx",
        sourcecode,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX
      );

      // Helper to find the type of a variable by name
      function getTypeOfVariable(varName: string): string {
        let typeString = "unknown";
        function findType(node: ts.Node): boolean {
          if (
            (ts.isVariableDeclaration(node) || ts.isParameter(node)) &&
            node.name.getText() === varName
          ) {
            const type = typeChecker.getTypeAtLocation(node);
            typeString = typeChecker.typeToString(type);
            return true;
          }
          return ts.forEachChild(node, findType) || false;
        }
        findType(file);
        return typeString;
      }

      usedVariables.forEach((varName) => {
        result[varName] = getTypeOfVariable(varName);
      });
    },
  });

  return result;
};

export default getTypedParameters;
