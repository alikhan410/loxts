import { Token } from "./Token";

export type VisitorExpr = {
  visitBinary(expr: Expr): any;
  visitLogical(expr: Expr): any;
  visitUnary(expr: Expr): any;
  visitAssign(expr: Expr): any;
  visitFunction(expr: Expr): any;
  visitClass(expr: Expr): any;
  visitVariable(expr: Expr): any;
  visitGrouping(expr: Expr): any;
  visitLiteral(expr: Expr): any;
  visitGet(expr: Expr): any;
  visitSet(expr: Expr): any;
  visitThis(expr: Expr): any;
};
export abstract class Expr {
  accept(visitor: VisitorExpr): any {}
}

export class Binary extends Expr {
  constructor(public left: Expr, public operator: Token, public right: Expr) {
    super();
  }

  accept(visitor: VisitorExpr) {
    return visitor.visitBinary(this);
  }
}

export class Unary extends Expr {
  constructor(public operator: Token, public right: Expr) {
    super();
  }
  accept(visitor: VisitorExpr) {
    return visitor.visitUnary(this);
  }
}
export class Grouping extends Expr {
  constructor(public expression: Expr) {
    super();
  }
  accept(visitor: VisitorExpr) {
    return visitor.visitGrouping(this);
  }
}

export class Literal extends Expr {
  constructor(public value: any) {
    super();
  }
  accept(visitor: VisitorExpr) {
    return visitor.visitLiteral(this);
  }
}

export class Function extends Expr {
  constructor(public callee: Expr, public paren: Token, public args: Expr[]) {
    super();
  }
  accept(visitor: VisitorExpr) {
    return visitor.visitFunction(this);
  }
}

export class Class extends Expr {
  constructor(public callee: Expr, public paren: Token, public args: Expr[]) {
    super();
  }
  accept(visitor: VisitorExpr) {
    return visitor.visitClass(this);
  }
}

export class Logical extends Expr {
  constructor(public left: Expr, public operator: Token, public right: Expr) {
    super();
  }
  accept(visitor: VisitorExpr) {
    return visitor.visitLogical(this);
  }
}

export class Variable extends Expr {
  constructor(public name: Token) {
    super();
  }
  accept(visitor: VisitorExpr) {
    return visitor.visitVariable(this);
  }
}

export class Get extends Expr {
  constructor(public object: Expr, public name: Token) {
    super();
  }
  accept(visitor: VisitorExpr) {
    return visitor.visitGet(this);
  }
}

export class Set extends Expr {
  constructor(public object: Expr, public name: Token, public value: Expr) {
    super();
  }
  accept(visitor: VisitorExpr) {
    return visitor.visitSet(this);
  }
}
export class This extends Expr {
  constructor(public keyword: Token) {
    super();
  }
  accept(visitor: VisitorExpr) {
    return visitor.visitThis(this);
  }
}
export class Assign extends Expr {
  constructor(public name: Token, public value: Expr) {
    super();
  }
  accept(visitor: VisitorExpr) {
    return visitor.visitAssign(this);
  }
}
