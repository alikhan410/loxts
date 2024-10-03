import { Environment } from "./Environment";
import { Expr } from "./Expr";
import { Token } from "./Token";

export type VisitorStmt = {
  visitPrint(stmt: Stmt): any;
  visitExpression(stmt: Stmt): any;
  visitVar(stmt: Stmt): any;
  visitFunctionStmt(stmt: Stmt): any;
  visitClassStmt(stmt: Stmt): any;
  visitIfStmt(stmt: Stmt): any;
  visitWhileStmt(stmt: Stmt): any;
  visitBlock(stmt: Stmt): any;
  visitReturnStmt(stmt: Stmt): any;
};

export abstract class Stmt {
  abstract acceptStmt(visitor: VisitorStmt): any;
}

export class Print extends Stmt {
  constructor(public expression: Expr) {
    super();
  }
  acceptStmt(visitor: VisitorStmt): any {
    return visitor.visitPrint(this);
  }
}

export class Expression extends Stmt {
  constructor(public expression: any) {
    super();
  }
  acceptStmt(visitor: VisitorStmt): any {
    return visitor.visitExpression(this);
  }
}

export class Var extends Stmt {
  constructor(public name: Token, public initializer: any) {
    super();
  }
  acceptStmt(visitor: VisitorStmt): any {
    return visitor.visitVar(this);
  }
}

export class FunctionStmt extends Stmt {
  constructor(public name: Token, public params: Token[], public body: Stmt[]) {
    super();
  }
  acceptStmt(visitor: VisitorStmt): any {
    return visitor.visitFunctionStmt(this);
  }
}

export class ClassStmt extends Stmt {
  constructor(public name: Token, public methods: FunctionStmt[]) {
    super();
  }
  acceptStmt(visitor: VisitorStmt): any {
    return visitor.visitClassStmt(this);
  }
}

export class IfStmt extends Stmt {
  constructor(public condition: any, public ifBranch: Stmt, public elseBranch: Stmt | null) {
    super();
  }
  acceptStmt(visitor: VisitorStmt): any {
    return visitor.visitIfStmt(this);
  }
}

export class WhileStmt extends Stmt {
  constructor(public condition: any, public body: Stmt) {
    super();
  }
  acceptStmt(visitor: VisitorStmt): any {
    return visitor.visitWhileStmt(this);
  }
}

export class Block extends Stmt {
  constructor(public statements: Stmt[]) {
    super();
  }
  acceptStmt(visitor: VisitorStmt): any {
    return visitor.visitBlock(this);
  }
}

export class ReturnStmt extends Stmt {
  constructor(public expr: Expr) {
    super();
  }
  acceptStmt(visitor: VisitorStmt) {
    return visitor.visitReturnStmt(this);
  }
}
