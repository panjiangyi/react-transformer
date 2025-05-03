import * as ts from "typescript";

/**
 * 获取 TypeScript 源代码中指定变量的类型
 * @param sourceCode TypeScript 源代码
 * @param variableName 要查询的变量名
 * @returns 变量的类型字符串，如果找不到则返回 undefined
 */
export function getVariableTypeFromSource(
  sourceCode: string,
  variableNames: string[]
): Record<string, string> {
  // 创建 TypeScript 源文件
  const sourceFile = ts.createSourceFile(
    "temp.ts",
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  // 初始化类型检查器
  const program = ts.createProgram({
    rootNames: ["temp.ts"],
    options: {},
    host: {
      ...ts.createCompilerHost({}),
      getSourceFile: (fileName) =>
        fileName === "temp.ts" ? sourceFile : undefined,
      writeFile: () => {},
      getDefaultLibFileName: () => "lib.d.ts",
      useCaseSensitiveFileNames: () => false,
      getCanonicalFileName: (fileName) => fileName,
      getCurrentDirectory: () => "",
      getNewLine: () => "\n",
      fileExists: (fileName) => fileName === "temp.ts",
      readFile: (fileName) => (fileName === "temp.ts" ? sourceCode : undefined),
    },
  });

  const checker = program.getTypeChecker();
  let resultTypes: Record<string, string> = {};

  // 遍历 AST 查找变量声明
  function visit(node: ts.Node) {
    if (
      ts.isVariableDeclaration(node) ||
      ts.isBindingElement(node)
      //    && variableNames.includes(node.name.getText(sourceFile))
    ) {
      const type = checker.getTypeAtLocation(node);
      resultTypes[node.name.getText(sourceFile)] = checker.typeToString(type);
      return;
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return resultTypes;
}
