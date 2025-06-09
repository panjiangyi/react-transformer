// src/lib/printNode.ts
import * as ts from "typescript";

/**
 * Prints a TypeScript node to a string representation
 * @param node The TypeScript node to print
 * @param options Optional configuration for the printer
 * @returns The string representation of the node
 */
export const printNode = (
  node: ts.Node | ts.Node[],
  sourceFile: ts.SourceFile
): string => {

  // Create printer with specified options
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
  });

  // Print the node
  if(Array.isArray(node)){
    return node.map((n) => printer.printNode(ts.EmitHint.Unspecified, n, sourceFile)).join("\n");
  }
  return printer.printNode(
    ts.EmitHint.Unspecified,
    node,
    sourceFile
  );
};