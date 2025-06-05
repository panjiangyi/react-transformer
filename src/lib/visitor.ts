import ts from "typescript";

function visitor(
  parent: ts.Node,
  node: ts.Node,
  start: number,
  callback: (parent: ts.Node, node: ts.Node) => void
) {
  node.forEachChild((child) => {
    visitor(node, child, start, callback);
  });
  if (start >= node.pos && start <= node.end) {
    callback(parent, node);
  }
}

export default visitor;
