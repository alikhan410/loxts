import { parseError } from "./errorHandling";
import {
  Assign,
  Binary,
  Class,
  Expr,
  Function,
  Get,
  Grouping,
  Literal,
  Logical,
  Set,
  This,
  Unary,
  Variable,
  VisitorExpr,
} from "./Expr";
import { Interpreter } from "./Interpreter";
import {
  Block,
  ClassStmt,
  Expression,
  FunctionStmt,
  IfStmt,
  Print,
  ReturnStmt,
  Stmt,
  Var,
  VisitorStmt,
  WhileStmt,
} from "./Stmt";

import { Token } from "./Token";

export class Resolver implements VisitorExpr, VisitorStmt {
  public scopes: Map<string, boolean>[] = [];
  constructor(private interpreter: Interpreter) {}

  visitPrint(stmt: Print) {
    this.resolve(stmt.expression);
  }

  visitExpression(stmt: Expression) {
    this.resolve(stmt.expression);
  }

  visitVar(stmt: Var) {
    this.declare(stmt.name);

    if (stmt.initializer !== null) {
      this.resolve(stmt.initializer);
    }
    this.define(stmt.name);
  }

  visitFunctionStmt(stmt: FunctionStmt) {
    this.declare(stmt.name);
    this.define(stmt.name);

    this.resolveFunction(stmt);
    return null;
  }

  resolveFunction(stmt: FunctionStmt) {
    this.beginScope();
    stmt.params.forEach((param) => {
      this.declare(param);
      this.define(param);
    });
    this.resolve(stmt.body);
    this.endScope();
  }

  visitClassStmt(stmt: ClassStmt) {
    this.declare(stmt.name);
    this.define(stmt.name);
    this.beginScope();
    this.scopes.at(-1)?.set("this", true);
    stmt.methods.forEach((m) => this.resolveFunction(m));
    this.endScope();

    return null;
  }

  visitIfStmt(stmt: IfStmt) {
    this.resolve(stmt.condition);
    this.resolve(stmt.ifBranch);
    if (stmt.elseBranch != null) {
      this.resolve(stmt.elseBranch);
    }
    return null;
  }

  visitWhileStmt(stmt: WhileStmt) {
    this.resolve(stmt.condition);
    this.resolve(stmt.body);
    return null;
  }

  visitBlock(stmt: Block) {
    this.beginScope();
    this.resolve(stmt.statements);
    this.endScope();
    return null;
  }

  visitReturnStmt(stmt: ReturnStmt) {
    if (stmt.expr != null) this.resolve(stmt.expr);
    return null;
  }

  visitBinary(expr: Binary) {
    this.resolve(expr.left);
    this.resolve(expr.right);
    return null;
  }

  visitLogical(expr: Logical) {
    this.resolve(expr.left);
    this.resolve(expr.right);
  }

  visitUnary(expr: Unary) {
    this.resolve(expr.right);
  }

  visitAssign(expr: Assign) {
    this.resolve(expr.value);
    this.resolveLocal(expr, expr.name);
    return null;
  }

  visitFunction(expr: Function) {
    this.resolve(expr.callee);

    expr.args.forEach((arg) => this.resolve(arg));
    return null;
  }

  visitClass(expr: Class) {
    this.resolve(expr.callee);
    expr.args.forEach((arg) => this.resolve(arg));
    return null;
  }

  visitThis(expr: This) {
    this.resolveLocal(expr, expr.keyword);
    return null;
  }

  visitVariable(expr: Variable) {
    if (this.scopes.length == 0) return;

    const isDefined = this.scopes.at(-1)?.get(expr.name.lexeme);
    if (isDefined != undefined && isDefined.valueOf() === false) {
      parseError(expr.name, "Can't read local variable in its own initializer.");
    }

    this.resolveLocal(expr, expr.name);
  }

  visitGet(expr: Get) {
    this.resolve(expr.object);
    return null;
  }
  visitSet(expr: Set) {
    this.resolve(expr.object);
    this.resolve(expr.value);
    return null;
  }

  visitGrouping(expr: Grouping) {
    this.resolve(expr.expression);
    return null;
  }

  visitLiteral(expr: Literal) {
    return null;
  }

  beginScope(): void {
    const newScope = new Map<any, boolean>();
    this.scopes.push(newScope);
  }

  endScope(): void {
    this.scopes.pop();
  }

  declare(name: Token) {
    if (this.scopes.length === 0) return;
    const scope = this.scopes.at(-1);
    scope?.set(name.lexeme, false);
  }

  define(name: Token) {
    if (this.scopes.length === 0) return;

    const scope = this.scopes.at(-1);
    scope?.set(name.lexeme, true);
  }

  resolveLocal(expr: Expr, name: Token) {
    for (let i = -1; i >= -this.scopes.length; i--) {
      const isScope = this.scopes.at(i)?.get(name.lexeme);
      // console.log(isScope);

      if (isScope) this.interpreter.resolve(expr, Math.abs(i + 1));
    }
  }

  resolve(x: Stmt[] | Stmt | Expr) {
    if (Array.isArray(x)) {
      x.forEach((statement) => this.resolve(statement));
    } else if (x instanceof Stmt) {
      x.acceptStmt(this);
    } else if (x instanceof Expr) {
      x.accept(this);
    }
  }
}
