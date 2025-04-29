/* eslint-disable eqeqeq */
import { parse } from "@babel/parser";
import traverse, { NodePath, VisitNode } from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";
import ts from "typescript";

const getTypescriptTypeChecker = (code: string) => {
  const file = ts.createSourceFile("temp.tsx", code, ts.ScriptTarget.Latest);
  const program = ts.createProgram(["temp.tsx"], {
    allowJs: true,
    checkJs: false,
    jsx: ts.JsxEmit.Preserve,
  });
  return program.getTypeChecker();
};

// 辅助函数：获取属性的名称和对应的 TypeScript 类型
const getAttributeNamesAndTypes = (
  attributes: t.JSXAttribute[],
  typeChecker: ts.TypeChecker
) => {
  return attributes.map((attr) => {
    if (!t.isJSXIdentifier(attr.name)) {
      return { name: "", type: "unknown" };
    }
    const name = attr.name.name;

    // 获取属性对应的值（如果是JSXExpressionContainer，取其表达式）
    let type = "unknown";
    if (t.isJSXExpressionContainer(attr.value)) {
      const expression = attr.value.expression;

      // 对于简单的表达式，直接推断类型
      if (t.isIdentifier(expression)) {
        type = "any"; // 默认类型
      } else if (t.isStringLiteral(expression)) {
        type = "string";
      } else if (t.isNumericLiteral(expression)) {
        type = "number";
      } else if (t.isBooleanLiteral(expression)) {
        type = "boolean";
      } else if (t.isNullLiteral(expression)) {
        type = "null";
      } else if (
        t.isArrowFunctionExpression(expression) ||
        t.isFunctionExpression(expression)
      ) {
        type = "Function";
      } else if (t.isObjectExpression(expression)) {
        type = "object";
      } else if (t.isArrayExpression(expression)) {
        type = "Array<any>";
      }
    } else if (t.isStringLiteral(attr.value)) {
      type = "string";
    }

    return { name, type };
  });
};

// 创建一个新的父JSXElement节点
const createParentJsxElement = (
  childNode: t.JSXElement,
  indentation?: t.Node,
  tagName: string = "div"
) => {
  let tmp = t.jsxText("\n  ");
  if (t.isJSXText(indentation)) {
    tmp = indentation;
  }
  return t.jsxElement(
    t.jsxOpeningElement(t.jsxIdentifier(tagName), []),
    t.jsxClosingElement(t.jsxIdentifier(tagName)),
    [tmp, childNode, tmp],
    false
  );
};

export const createStart =
  (
    implementation: (
      path: NodePath<t.JSXElement>,
      typeChecker: ts.TypeChecker,
      ...args: any[]
    ) => unknown
  ) =>
  (sourcecode: string, start: number, ...args: any[]) => {
    const typeChecker = getTypescriptTypeChecker(sourcecode);
    const ast = parse(sourcecode, {
      sourceType: "module",
      allowImportExportEverywhere: true,
      plugins: ["jsx", "typescript"],
    });
    traverse(ast, {
      JSXElement(path) {
        const _start = path.node.openingElement.start ?? Infinity;
        const _end = path.node.openingElement.end ?? -Infinity;
        if (start < _start || start > _end) {
          return;
        }
        return implementation(path, typeChecker, ...args);
      },
    });
    const { code } = generate(ast, {
      jsescOption: {
        minimal: false,
      },
      compact: false, // 不压缩输出
      minified: false, // 不生成最小化代码
      concise: false, // 不省略不必要的空格和行
      retainLines: true, // 保留原始代码中的行号
    });
    return code;
  };

export const wrapWithDiv = createStart(
  (path, typeChecker, tagName: string = "div") => {
    let IndentationJSXText = path.getSibling((path.key as number) - 1).node;

    const parentJsxElement = createParentJsxElement(
      path.node,
      IndentationJSXText,
      tagName
    );
    path.replaceWith(parentJsxElement);
    path.skip();
  }
);

const findNextJsxElementSibling = (path: NodePath) => {
  let siblingPath = path.getSibling((path.key as number) + 1);
  while (siblingPath.node && !t.isJSXElement(siblingPath.node)) {
    siblingPath = siblingPath.getSibling((siblingPath.key as number) + 1);
  }
  return siblingPath;
};
export const SwapWithSibling = createStart((path) => {
  const nextSiblingPath = findNextJsxElementSibling(path);

  if (!nextSiblingPath.isJSXElement()) {
    return;
  }
  const currentNode = t.cloneNode(path.node);
  const nextNode = t.cloneNode(nextSiblingPath.node);

  // 替换当前节点为下一个兄弟节点
  path.replaceWith(nextNode);

  // 替换下一个兄弟节点为当前节点
  nextSiblingPath.replaceWith(currentNode);
  nextSiblingPath.skip();
  path.skip();
});

export const swapParentChild = createStart((path: NodePath) => {
  const parentPath = path.parentPath;
  if (parentPath == null) {
    return;
  }

  // 确保父节点和子节点都是JSXElement
  if (t.isJSXElement(parentPath.node) && t.isJSXElement(path.node)) {
    const parentTagName = parentPath.node.openingElement.name;
    const childTagName = path.node.openingElement.name;

    parentPath.node.openingElement.name = childTagName;
    if (parentPath.node.closingElement) {
      parentPath.node.closingElement.name = childTagName;
    }

    path.node.openingElement.name = parentTagName;
    if (path.node.closingElement) {
      path.node.closingElement.name = parentTagName;
    }

    // 交换属性
    const parentAttributes = parentPath.node.openingElement.attributes;
    const childAttributes = path.node.openingElement.attributes;

    parentPath.node.openingElement.attributes = childAttributes;
    path.node.openingElement.attributes = parentAttributes;
  }
});
export const extract = createStart((path, typeChecker) => {
  try {
    // Get all variables used in the JSX element
    const usedVariables = new Set<string>();
    const usedProps = new Set<string>();

    // Create a new AST for the JSX element to traverse
    const jsxCode = generate(path.node).code;
    const jsxAst = parse(jsxCode, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    // Traverse the JSX element to find used variables
    traverse(jsxAst, {
      Identifier(innerPath) {
        const binding = innerPath.scope.getBinding(innerPath.node.name);
        if (
          binding &&
          !binding.path.isFunctionDeclaration() &&
          !binding.path.isFunctionExpression()
        ) {
          usedVariables.add(innerPath.node.name);
        }
      },
      JSXAttribute(innerPath) {
        if (t.isJSXIdentifier(innerPath.node.name)) {
          usedProps.add(innerPath.node.name.name);
        }
      },
    });

    // Get the JSX element's attributes and their types
    const attributes = getAttributeNamesAndTypes(
      path.node.openingElement.attributes as unknown as t.JSXAttribute[],
      typeChecker
    );

    // Create the function component
    const componentName = t.identifier("NewFunction");

    // Create type parameters for the props
    const propsType = t.tsTypeLiteral(
      attributes.map((attr) =>
        t.tsPropertySignature(
          t.identifier(attr.name),
          t.tsTypeAnnotation(t.tsTypeReference(t.identifier(attr.type)))
        )
      )
    );

    // Create props parameter with type
    const propsParam = t.identifier("props");
    propsParam.typeAnnotation = t.tsTypeAnnotation(
      t.tsTypeReference(t.identifier("Props"))
    );

    // Create a new JSX element with props references
    const newJsxElement = t.cloneNode(path.node);
    newJsxElement.openingElement.attributes = attributes.map((attr) => {
      const propValue = t.jsxExpressionContainer(
        t.memberExpression(t.identifier("props"), t.identifier(attr.name))
      );
      return t.jsxAttribute(t.jsxIdentifier(attr.name), propValue);
    });

    // Create the function component
    const functionComponent = t.variableDeclaration("const", [
      t.variableDeclarator(
        componentName,
        t.arrowFunctionExpression(
          [propsParam],
          t.blockStatement([t.returnStatement(newJsxElement)])
        )
      ),
    ]);

    // Add type definition for Props
    const typeDefinition = t.tsTypeAliasDeclaration(
      t.identifier("Props"),
      null,
      propsType
    );

    // Replace the JSX element with the new component
    const jsxIdentifier = t.jsxIdentifier("NewFunction");
    const jsxElement = t.jsxElement(
      t.jsxOpeningElement(jsxIdentifier, []),
      t.jsxClosingElement(jsxIdentifier),
      [],
      false
    );
    path.replaceWith(jsxElement);

    // Insert the new component and type definition at the end of the file
    const program = path.findParent((p) => t.isProgram(p.node));
    if (program && t.isProgram(program.node)) {
      program.node.body.push(typeDefinition, functionComponent);
    }
  } catch (error) {
    console.error(error);
  }
});

export const convertToArrowFunction = createStart((path, typeChecker) => {
  // Find the nearest function declaration or expression
  const functionPath = path.findParent(
    (p) =>
      t.isFunctionDeclaration(p.node) ||
      t.isFunctionExpression(p.node) ||
      t.isArrowFunctionExpression(p.node)
  );

  if (!functionPath) {
    return;
  }

  const node = functionPath.node;

  // Skip if it's already an arrow function
  if (t.isArrowFunctionExpression(node)) {
    return;
  }

  // Type guard to ensure we have a function node
  if (!t.isFunctionDeclaration(node) && !t.isFunctionExpression(node)) {
    return;
  }

  // Create parameters array
  const params = node.params;

  // Create arrow function
  const arrowFunction = t.arrowFunctionExpression(
    params,
    t.isBlockStatement(node.body)
      ? node.body
      : t.blockStatement([t.returnStatement(node.body as t.Expression)]),
    false
  );

  // Handle TypeScript types
  if (node.returnType) {
    arrowFunction.returnType = node.returnType;
  }
  if (node.typeParameters) {
    arrowFunction.typeParameters = node.typeParameters;
  }

  // Check if the function is exported
  const isDefaultExported =
    functionPath.parentPath?.isExportDefaultDeclaration();
  const isNamedExported = functionPath.parentPath?.isExportNamedDeclaration();

  if (isDefaultExported) {
    // For default exports, create a const declaration and separate export
    const variableName = node.id?.name || "anonymous";
    const variableDeclaration = t.variableDeclaration("const", [
      t.variableDeclarator(t.identifier(variableName), arrowFunction),
    ]);

    const exportDefault = t.exportDefaultDeclaration(
      t.identifier(variableName)
    );
    functionPath.parentPath?.replaceWithMultiple([
      variableDeclaration,
      exportDefault,
    ]);
  } else if (isNamedExported) {
    // For named exports, just replace the function with arrow function
    const variableName = node.id?.name || "anonymous";
    const variableDeclaration = t.variableDeclaration("const", [
      t.variableDeclarator(t.identifier(variableName), arrowFunction),
    ]);
    functionPath.replaceWith(variableDeclaration);
  } else {
    // Create variable declaration or assignment for non-exported functions
    if (t.isFunctionDeclaration(node)) {
      const variableDeclaration = t.variableDeclaration("const", [
        t.variableDeclarator(
          t.identifier(node.id?.name || "anonymous"),
          arrowFunction
        ),
      ]);
      functionPath.replaceWith(variableDeclaration);
    } else if (t.isFunctionExpression(node)) {
      const parent = functionPath.parentPath;
      if (parent && t.isVariableDeclarator(parent.node)) {
        parent.node.init = arrowFunction;
      } else {
        const variableDeclaration = t.variableDeclaration("const", [
          t.variableDeclarator(t.identifier("anonymous"), arrowFunction),
        ]);
        functionPath.replaceWith(variableDeclaration);
      }
    }
  }

  functionPath.skip();
});
