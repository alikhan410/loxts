import { Environment } from "./Environment";
import { handleRuntimeError, RuntimeError } from "./errorHandling";
import { Callable } from "./Callable";
import {
  Expr,
  Unary,
  Logical,
  Binary,
  Variable,
  Assign,
  VisitorExpr,
  Literal,
  Function,
  Grouping,
  Class,
  Get,
  Set,
  This,
} from "./Expr";
import {
  Stmt,
  Block,
  Expression,
  FunctionStmt,
  IfStmt,
  Print,
  Var,
  VisitorStmt,
  WhileStmt,
  ReturnStmt,
  ClassStmt,
} from "./Stmt";
import { LoxFunction } from "./LoxFunction";
import { Token } from "./Token";

export class Interpreter implements VisitorExpr, VisitorStmt {
  public global = new Environment();
  public environment = this.global;
  public local = new Map<Expr, number>();

  constructor() {}

  interpret = (statements: Stmt[]) => {
    try {
      statements.forEach((statement) => {
        this.execute(statement);
      });
    } catch (exception: any) {
      if (exception instanceof RuntimeError) {
        handleRuntimeError(exception);
      }
    }
  };

  resolve(expr: Expr, depth: number) {
    this.local.set(expr, depth);
    return null;
  }

  lookUpVariable(name: Token, expr: Expr): any {
    const distance = this.local.get(expr);
    if (distance != null) {
      return this.environment.getAt(distance, name);
    } else {
      return this.global.get(name);
    }
  }

  visitUnary(expr: Unary): any {
    const right = this.evaluate(expr.right);
    if (expr.operator.type === "MINUS") {
      return -right;
    } else if (expr.operator.type === "BANG") {
      return !this.isTruthy(right);
    }
    throw new Error("Unknown unary operator.");
  }

  // Method to determine if a value is truthy
  isTruthy(val: any): boolean {
    // Check if value is null or undefined
    if (val === null || val === undefined) {
      return false;
    }
    // Convert value to boolean
    return Boolean(val);
  }

  isEqual(val1: any, val2: any): boolean {
    return val1 == val2;
  }

  visitLogical(expr: Logical): any {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case "LOGICAL_OR":
        return left || right;
      case "LOGICAL_AND":
        return left && right;
      default:
        throw new Error("Unknown binary operator.");
    }
  }

  visitBinary(expr: Binary): any {
    const right = this.evaluate(expr.right);
    const left = this.evaluate(expr.left);
    switch (expr.operator.type) {
      case "MINUS":
        return left - right;
      case "PLUS":
        if (typeof left == "string" && typeof right == "string") {
          return left + right;
        }
        if (typeof left == "number" && typeof right == "number") {
          return left + right;
        }
      case "GREATER":
        return left > right;

      case "GREATER_EQUAL":
        return left >= right;

      case "LESSER":
        return left < right;

      case "LESSER_EQUAL":
        return left <= right;
      case "BANG_EQUAL":
        return !this.isEqual(left, right);
      case "EQUAL_EQUAL":
        return this.isEqual(left, right);
      case "SLASH":
        if (typeof left == "number" && typeof right == "number") {
          return left / right;
        }
      case "ASTERISK":
        if (typeof left == "number" && typeof right == "number") {
          return left * right;
        } else {
          throw new Error("Not a number");
        }
      default:
        throw new Error("Unknown binary operator.");
    }
  }
  visitVariable = (expr: Variable): Expr => {
    return this.lookUpVariable(expr.name, expr);
  };

  visitGet(expr: Get) {
    const object = this.evaluate(expr.object);
    if (object instanceof LoxInstance) {
      // console.log((object as LoxInstance).get(expr.name));
      return (object as LoxInstance).get(expr.name);
    }
    throw new RuntimeError(expr.name, "Only instances have properties.");
  }

  visitSet(expr: Set) {
    const object = this.evaluate(expr.object);

    if (!(object instanceof LoxInstance)) {
      throw new RuntimeError(expr.name, "Only instances have fields.");
    }
    const value = this.evaluate(expr.value);
    return object.set(expr.name, value);
  }

  visitAssign = (expr: Assign): void => {
    const value = this.evaluate(expr.value);
    this.environment.assign(expr.name, value);
    return value; //we return value in case of nested assignment a=b=c=10
  };

  visitFunction = (expr: Function): any => {
    const callee = this.evaluate(expr.callee);
    // console.log(callee);
    if (callee instanceof LoxClass) {
      throw new RuntimeError(expr.paren, `Can not call method directly on '${callee.name}' Class`);
    }

    // Check if the callee is a callable object
    if (typeof (callee as Callable).call !== "function") {
      throw new RuntimeError(expr.paren, "Can only call functions and classes.");
    }

    const args: any[] = [];

    expr.args.forEach((arg) => {
      args.push(this.evaluate(arg));
    });

    const func = callee as Callable;
    if (args.length != func.arity()) {
      throw new RuntimeError(expr.paren, `"Expected ${func.arity()} arguments but got ${args.length}.`);
    }

    return func.call(this, args);
  };

  visitClass(expr: Class) {
    const callee = this.evaluate(expr.callee);

    if (typeof (callee as Callable).call !== "function") {
      throw new RuntimeError(expr.paren, "Can only call functions and classes.");
    }

    const args: any[] = [];

    expr.args.forEach((arg) => {
      args.push(this.evaluate(arg));
    });

    const loxClass = callee as Callable;
    if (args.length != loxClass.arity()) {
      throw new RuntimeError(expr.paren, `"Expected ${loxClass.arity()} arguments but got ${args.length}.`);
    }

    return loxClass.call(this, args);
  }

  visitThis(expr: This): any {
    return this.lookUpVariable(expr.keyword, expr);
  }

  visitLiteral(expr: Literal) {
    return expr.value;
  }

  visitGrouping(expr: Grouping) {
    this.evaluate(expr);
  }

  evaluate(expr: Expr): any {
    const c = expr.accept(this);
    // console.log(expr, c);
    return c;
  }

  execute = (stmt: Stmt): any => {
    const returnStmt = stmt.acceptStmt(this);
    return returnStmt;
  };

  visitBlock(stmt: Block) {
    return this.executeBlock(stmt.statements, new Environment(this.environment));
  }

  executeBlock = (statements: Stmt[], environment: Environment): any => {
    const previous = this.environment;
    try {
      //its the new env we passed for block statements so every thing will be executed in this scope
      this.environment = environment;
      //Executing block statements
      statements.forEach((statement) => {
        const returnValue = this.execute(statement);
        if (returnValue != null) {
          throw new ReturnFlow(returnValue);
        }
      });
    } catch (e) {
      if (e instanceof ReturnFlow) return e.value;

      throw e;
    } finally {
      //restore the original environment
      this.environment = previous;
    }
  };

  visitExpression = (stmt: Expression) => {
    this.evaluate(stmt.expression);
  };

  visitPrint = (stmt: Print) => {
    const value = this.evaluate(stmt.expression);
    if (value instanceof LoxFunction || value instanceof LoxClass || value instanceof LoxInstance) {
      console.log(value.toString());
      return;
    }
    console.log(value);
  };
  visitVar = (stmt: Var) => {
    let value = null;
    if (stmt.initializer != null) {
      value = this.evaluate(stmt.initializer);
    }
    this.environment.define(stmt.name.lexeme, value);
  };

  visitIfStmt = (stmt: IfStmt) => {
    if (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.ifBranch);
    } else {
      if (stmt.elseBranch == null) return;
      this.execute(stmt.elseBranch);
    }
  };

  visitWhileStmt = (stmt: WhileStmt) => {
    while (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.body);
    }
  };

  visitReturnStmt = (stmt: ReturnStmt) => {
    const expr = this.evaluate(stmt.expr);
    return expr;
  };

  visitFunctionStmt = (stmt: FunctionStmt) => {
    const newFunction = new LoxFunction(stmt, this.environment);
    this.environment.define(stmt.name.lexeme, newFunction);
  };

  visitClassStmt(stmt: ClassStmt) {
    this.environment.define(stmt.name.lexeme, null);

    const methods = new Map<string, LoxFunction>();

    stmt.methods.forEach((method) => {
      const loxFunction = new LoxFunction(method, this.environment);
      methods.set(method.name.lexeme, loxFunction);
    });

    const newClass = new LoxClass(stmt.name.lexeme, methods);

    this.environment.assign(stmt.name, newClass);
  }
}

class ReturnFlow extends Error {
  constructor(public value: any) {
    super();
  }
}

export class LoxClass implements Callable {
  constructor(public readonly name: string, private methods: Map<string, LoxFunction>) {}

  arity(): number {
    return 0;
  }

  call(interpreter: Interpreter, args: any[]) {
    const instance = new LoxInstance(this);
    return instance;
  }

  findMethod(name: string) {
    if (this.methods.has(name)) {
      return this.methods.get(name);
    }
    return null;
  }

  toString(): string {
    return `<class ${this.name}>`;
  }
}

export class LoxInstance {
  private readonly fields = new Map<string, any>();

  constructor(private loxClass: LoxClass) {}

  get(name: Token): any {
    if (this.fields.has(name.lexeme)) {
      return this.fields.get(name.lexeme);
    }

    const method = this.loxClass.findMethod(name.lexeme);

    if (method != null) {
      const func = method.bind(this);
      // console.log(func.closure.map.get("this"));
      return func;
    }

    throw new RuntimeError(name, "Undefined property '" + name.lexeme + "'.");
  }

  set(name: Token, value: any) {
    this.fields.set(name.lexeme, value);
  }

  toString() {
    return `<Instance ${this.loxClass.name}>`;
  }
}
