import * as ts from "typescript";

export const getProgramFronSouceCode = (code: string) => {
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
