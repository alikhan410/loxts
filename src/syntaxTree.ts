// import { Token } from "./Token";

// export type BinaryExpr = {
//   type: "binary";
//   left: Expr;
//   operator: Token;
//   right: Expr;
// };

// export type UnaryExpr = {
//   type: "unary";
//   operator: Token;
//   right: Expr;
// };

// export type LiteralExpr = {
//   type: "literal";
//   value: number | string | boolean | null;
// };
// export type Logical = {
//   type: "logical";
//   left: Expr;
//   operator: Token;
//   right: Expr;
// };
// export type GroupingExpr = {
//   type: "grouping";
//   expression: Expr;
// };

// export type Variable = {
//   type: "variable";
//   name: Token;
// };

// export type Assign = {
//   type: "assign";
//   name: Token;
//   value: Expr;
// };

// export type Func = {
//   type: "func";
//   callee: Expr;
//   paren: Token;
//   statements: Stmt[];
// };

// export type Expression = {
//   type: "expressionStmt";
//   expression: Expr;
// };
// export type Print = {
//   type: "printStmt";
//   expression: Expr;
// };
// export type Statement = {
//   type: "statement";
//   stmt: Stmt;
// };

// export type Var = {
//   type: "var";
//   name: Token;
//   initializer: Expr | null;
// };
// export type Block = {
//   type: "block";
//   statements: Stmt[];
// };
// export type IfStmt = {
//   type: "ifStmt";
//   condition: Expr;
//   ifBranch: Stmt;
//   elseBranch: Stmt | null;
// };
// export type WhileStmt = {
//   type: "whileStmt";
//   condition: Expr;
//   whileBody: Stmt;
// };

// export type Expr = BinaryExpr | UnaryExpr | LiteralExpr | Logical | GroupingExpr | Variable | Assign | Func;
// export type Stmt = Expression | Print | Var | Block | IfStmt | WhileStmt;
// // export type Declaration = Statement | VarDecl;

// export const binaryExpr = (left: Expr, operator: Token, right: Expr): Expr => ({
//   type: "binary",
//   left,
//   operator,
//   right,
// });

// export const unaryExpr = (operator: Token, right: Expr): Expr => ({
//   type: "unary",
//   operator,
//   right,
// });

// export const literalExpr = (value: number | string | boolean | null): LiteralExpr => ({
//   type: "literal",
//   value,
// });
// export const logical = (left: Expr, operator: Token, right: Expr): Expr => ({
//   type: "logical",
//   left,
//   operator,
//   right,
// });
// export const groupingExpr = (expression: Expr): Expr => ({
//   type: "grouping",
//   expression,
// });

// export const variableAccess = (name: Token): Expr => ({
//   type: "variable",
//   name: name,
// });

// export const assignExpr = (name: Token, expr: Expr): Expr => ({
//   type: "assign",
//   name: name,
//   value: expr,
// });

// export const func = (callee: Expr, paren: Token, statements: Stmt[]): Func => ({
//   type: "func",
//   callee,
//   paren,
//   statements,
// });

// export function printExpr(expr: Expr): string {
//   switch (expr.type) {
//     case "binary":
//       return parenthesize(expr.operator.lexeme, expr.left, expr.right);
//     case "unary":
//       return parenthesize(expr.operator.lexeme, expr.right);
//     case "literal":
//       return expr.value === null ? "nil" : expr.value.toString();
//     case "grouping":
//       return parenthesize("group", expr.expression);
//     default:
//       throw new Error("Unknown expression type");
//   }
// }

// export const stmtExpression = (expr: Expr): Expression => ({
//   type: "expressionStmt",
//   expression: expr,
// });

// export const stmtPrint = (expr: Expr): Print => ({
//   type: "printStmt",
//   expression: expr,
// });

// export const varDecl = (name: Token, initializer: Expr | null): Var => ({
//   type: "var",
//   name,
//   initializer,
// });

// export const block = (statements: Stmt[]): Block => ({
//   type: "block",
//   statements,
// });

// export const ifStmt = (condition: Expr, ifBranch: Stmt, elseBranch: Stmt | null): IfStmt => ({
//   type: "ifStmt",
//   condition,
//   ifBranch,
//   elseBranch,
// });

// export const whileStmt = (condition: Expr, whileBody: Stmt): WhileStmt => ({
//   type: "whileStmt",
//   condition,
//   whileBody,
// });
// function parenthesize(name: string, ...exprs: Expr[]): string {
//   return `(${name} ${exprs.map(printExpr).join(" ")})`;
// }
// Token Import
// import { Expr } from "./Expr";
// import { Token } from "./Token";

// ======================
// Expression Types
// ======================

// export type Expr =
//   | BinaryExpr
//   | UnaryExpr
//   | LiteralExpr
//   | LogicalExpr
//   | GroupingExpr
//   | VariableExpr
//   | AssignExpr
//   | FuncExpr;

// export type BinaryExpr = {
//   type: "binary";
//   left: Expr;
//   operator: Token;
//   right: Expr;
// };

// export type UnaryExpr = {
//   type: "unary";
//   operator: Token;
//   right: Expr;
// };

// export type LiteralExpr = {
//   type: "literal";
//   value: number | string | boolean | null;
// };

// export type LogicalExpr = {
//   type: "logical";
//   left: Expr;
//   operator: Token;
//   right: Expr;
// };

// export type GroupingExpr = {
//   type: "grouping";
//   expression: Expr;
// };

// export type VariableExpr = {
//   type: "variable";
//   name: Token;
// };

// export type AssignExpr = {
//   type: "assign";
//   name: Token;
//   value: Expr;
// };

// export type FuncExpr = {
//   type: "func";
//   callee: Expr;
//   paren: Token;
//   args: Expr[];
// };

// ======================
// Statement Types
// ======================

// export type Stmt = ExpressionStmt | PrintStmt | VarStmt | BlockStmt | IfStmt | WhileStmt | FunctionStmt;

// export type ExpressionStmt = {
//   type: "expressionStmt";
//   expression: Expr;
// };

// export type PrintStmt = {
//   type: "printStmt";
//   expression: Expr;
// };

// export type VarStmt = {
//   type: "varStmt";
//   name: Token;
//   initializer: Expr | null;
// };

// export type BlockStmt = {
//   type: "blockStmt";
//   statements: Stmt[];
// };

// export type IfStmt = {
//   type: "ifStmt";
//   condition: Expr;
//   ifBranch: Stmt;
//   elseBranch: Stmt | null;
// };

// export type WhileStmt = {
//   type: "whileStmt";
//   condition: Expr;
//   body: Stmt;
// };

// export type FunctionStmt = {
//   type: "functionStmt";
//   name: Token;
//   params: Token[];
//   body: Stmt[];
// };
// ======================
// Helper Functions
// ======================

// Expression helper functions
// export const binaryExpr = (left: Expr, operator: Token, right: Expr): BinaryExpr => ({
//   type: "binary",
//   left,
//   operator,
//   right,
// });

// export const unaryExpr = (operator: Token, right: Expr): UnaryExpr => ({
//   type: "unary",
//   operator,
//   right,
// });

// export const literalExpr = (value: number | string | boolean | null): LiteralExpr => ({
//   type: "literal",
//   value,
// });

// export const logicalExpr = (left: Expr, operator: Token, right: Expr): LogicalExpr => ({
//   type: "logical",
//   left,
//   operator,
//   right,
// });

// export const groupingExpr = (expression: Expr): GroupingExpr => ({
//   type: "grouping",
//   expression,
// });

// export const variableExpr = (name: Token): VariableExpr => ({
//   type: "variable",
//   name,
// });

// export const assignExpr = (name: Token, value: Expr): AssignExpr => ({
//   type: "assign",
//   name,
//   value,
// });

// export const funcExpr = (callee: Expr, paren: Token, args: Expr[]): FuncExpr => ({
//   type: "func",
//   callee,
//   paren,
//   args,
// });

// Statement helper functions
// export const expressionStmt = (expression: Expr): ExpressionStmt => ({
//   type: "expressionStmt",
//   expression,
// });

// export const printStmt = (expression: Expr): PrintStmt => ({
//   type: "printStmt",
//   expression,
// });

// export const varStmt = (name: Token, initializer: Expr | null): VarStmt => ({
//   type: "varStmt",
//   name,
//   initializer,
// });

// export const blockStmt = (statements: Stmt[]): BlockStmt => ({
//   type: "blockStmt",
//   statements,
// });

// export const ifStmt = (condition: Expr, ifBranch: Stmt, elseBranch: Stmt | null): IfStmt => ({
//   type: "ifStmt",
//   condition,
//   ifBranch,
//   elseBranch,
// });

// export const whileStmt = (condition: Expr, body: Stmt): WhileStmt => ({
//   type: "whileStmt",
//   condition,
//   body,
// });

// export const functionStmt = (name: Token, params: Token[], body: Stmt[]): FunctionStmt => ({
//   type: "functionStmt",
//   name,
//   params,
//   body,
// });
// Utility function for printing expressions
// export function printExpr(expr: Expr): string {
//   switch (expr.type) {
//     case "binary":
//       return parenthesize(expr.operator.lexeme, expr.left, expr.right);
//     case "unary":
//       return parenthesize(expr.operator.lexeme, expr.right);
//     case "literal":
//       return expr.value === null ? "nil" : expr.value.toString();
//     case "grouping":
//       return parenthesize("group", expr.expression);
//     default:
//       throw new Error("Unknown expression type");
//   }
// }

// function parenthesize(name: string, ...exprs: Expr[]): string {
//   return `(${name} ${exprs.map(printExpr).join(" ")})`;
// }
