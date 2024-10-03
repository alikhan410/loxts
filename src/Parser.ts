import { parseError, ParsingError } from "./errorHandling";
import { Block, ClassStmt, Expression, FunctionStmt, IfStmt, Print, ReturnStmt, Stmt, Var, WhileStmt } from "./Stmt";
import {
  Expr,
  Assign,
  Logical,
  Binary,
  Unary,
  Function,
  Literal,
  Variable,
  Grouping,
  Class,
  Get,
  Set,
  This,
} from "./Expr";
import { Token, TokenType } from "./Token";

export class Parser {
  private tokens: Token[];
  private current = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  // Token management methods
  private match = (...types: TokenType[]): boolean => {
    for (let type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  };

  private advance = (): Token => {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  };

  private peek = (): Token => this.tokens[this.current];

  private previous = (): Token => this.tokens[this.current - 1];

  private check = (type: TokenType): boolean => {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  };

  public isAtEnd = (): boolean => this.peek().type === "EOF";

  // Error handling and synchronization
  private synchronize = (): void => {
    this.advance();
    while (!this.isAtEnd()) {
      if (this.previous().type === "SEMICOLON") return;

      switch (this.peek().type) {
        case "CLASS":
        case "FUN":
        case "VAR":
        case "FOR":
        case "IF":
        case "WHILE":
        case "PRINT":
        case "RETURN":
          return;
      }
      this.advance();
    }
  };

  // Parse program (entry point)
  public parse(): Stmt[] {
    const statements: Stmt[] = [];
    try {
      while (!this.isAtEnd()) {
        statements.push(this.declaration());
      }
      return statements;
    } catch (error) {
      this.synchronize();
      this.parse(); // Attempt to recover and continue parsing
    }
    return statements;
  }

  // Parse various statement types
  private statement = (): Stmt => {
    if (this.match("WHILE")) return this.whileStatement();
    if (this.match("IF")) return this.ifStatement();
    if (this.match("PRINT")) return this.printStatement();
    if (this.match("LEFT_BRACE")) return this.blockStatement();
    if (this.match("RETURN")) return this.returnStatement();
    return this.expressionStatement();
  };

  private printStatement = (): Stmt => {
    const value = this.expression();
    this.consume("SEMICOLON", "Expect ';' after value.");
    return new Print(value);
  };

  private expressionStatement = (): Stmt => {
    const value = this.expression();
    this.consume("SEMICOLON", "Expect ';' after expression.");
    return new Expression(value);
  };

  private blockStatement = (): Block => {
    const statements: Stmt[] = [];
    while (!this.check("RIGHT_BRACE") && !this.isAtEnd()) {
      statements.push(this.declaration());
    }
    this.consume("RIGHT_BRACE", "Expect '}' after block.");
    return new Block(statements);
  };

  private ifStatement = (): IfStmt => {
    this.consume("LEFT_PAREN", "Expect '(' after 'if'.");
    const condition = this.expression();
    this.consume("RIGHT_PAREN", "Expect ')' after condition.");
    const ifBranch = this.statement();
    let elseBranch = null;
    if (this.match("ELSE")) {
      elseBranch = this.statement();
    }
    return new IfStmt(condition, ifBranch, elseBranch);
  };

  private whileStatement = (): WhileStmt => {
    this.consume("LEFT_PAREN", "Expect '(' after 'while'.");
    const condition = this.expression();
    this.consume("RIGHT_PAREN", "Expect ')' after condition.");
    const whileBody = this.statement();
    return new WhileStmt(condition, whileBody);
  };

  private returnStatement = () => {
    const expr = this.expression();
    this.consume("SEMICOLON", "Expect ';' after return statement");
    return new ReturnStmt(expr);
  };

  private declaration = (): Stmt => {
    if (this.match("VAR")) return this.varDeclaration();
    if (this.match("FUN")) return this.functionDeclaration();
    if (this.match("CLASS")) return this.classDeclaration();

    return this.statement();
  };

  private varDeclaration = (): Var => {
    const name = this.consume("IDENTIFIER", "Expect variable name.");
    let initializer = null;
    if (this.match("EQUAL")) {
      initializer = this.initialization();
    }
    this.consume("SEMICOLON", "Expect ';' after variable declaration.");

    return new Var(name, initializer);
  };

  private functionDeclaration = (): FunctionStmt => {
    const name = this.advance();

    this.consume("LEFT_PAREN", "Expected '(' after function name to begin parameter list.");

    const params: Token[] = [];
    if (!this.match("RIGHT_PAREN")) {
      params.push(this.advance());
      while (this.match("COMMA")) {
        params.push(this.advance());
      }
      this.consume("RIGHT_PAREN", "Expected ')' to close the parameter list.");
    }
    this.consume("LEFT_BRACE", "Expected '{' to begin the function body.");

    const body = this.blockStatement();

    return new FunctionStmt(name, params, body.statements);
  };

  classDeclaration(): ClassStmt {
    const name = this.consume("IDENTIFIER", "Syntax error: expected identifier.");

    this.consume("LEFT_BRACE", "Syntax error: expected '{'.");

    const funcArray = [];
    while (!this.check("RIGHT_BRACE") && !this.isAtEnd()) {
      funcArray.push(this.functionDeclaration());
    }
    this.consume("RIGHT_BRACE", "Syntax error: expected '}'.");

    return new ClassStmt(name, funcArray);
  }

  // Parse expressions
  private expression = (): Expr => this.assignment();

  private assignment = (): Expr => {
    let expr = this.or();
    if (this.match("EQUAL")) {
      const equals = this.previous();
      const value = this.assignment();
      if (expr instanceof Variable) {
        // return assignExpr(expr.name, value);
        return new Assign(expr.name, value);
      } else if (expr instanceof Get) {
        const get = expr as Get;

        return new Set(get.object, get.name, value);
      }
      parseError(equals, "Invalid assignment target.");
    }
    return expr;
  };

  private or = (): Expr => {
    let expr = this.and();
    while (this.match("LOGICAL_OR")) {
      const operator = this.previous();
      const right = this.and();
      // expr = logicalExpr(expr, operator, right);
      expr = new Logical(expr, operator, right);
    }
    return expr;
  };

  private and = (): Expr => {
    let expr = this.equality();
    while (this.match("LOGICAL_AND")) {
      const operator = this.previous();
      const right = this.equality();
      // expr = logicalExpr(expr, operator, right);
      expr = new Logical(expr, operator, right);
    }
    return expr;
  };

  private initialization() {
    if (this.match("NEW")) {
      const callee = this.primary();
      const args = [];

      if (this.match("LEFT_PAREN")) {
        if (!this.check("RIGHT_PAREN")) {
          args.push(this.expression());
          while (this.match("COMMA")) {
            args.push(this.expression());
          }
        }
      }

      const paren = this.consume("RIGHT_PAREN", "Expect ')' after arguments.");
      return new Class(callee, paren, args);
    }
    return this.equality();
  }

  private equality = (): Expr => {
    let expr = this.comparison();
    while (this.match("BANG_EQUAL", "EQUAL_EQUAL")) {
      const operator = this.previous();
      const right = this.comparison();
      // expr = binaryExpr(expr, operator, right);
      expr = new Binary(expr, operator, right);
    }
    return expr;
  };

  private comparison = (): Expr => {
    let expr = this.term();
    while (this.match("GREATER", "GREATER_EQUAL", "LESSER", "LESSER_EQUAL")) {
      const operator = this.previous();
      const right = this.term();
      // expr = binaryExpr(expr, operator, right);
      expr = new Binary(expr, operator, right);
    }
    return expr;
  };

  private term = (): Expr => {
    let expr = this.factor();
    while (this.match("MINUS", "PLUS")) {
      const operator = this.previous();
      const right = this.factor();
      // expr = binaryExpr(expr, operator, right);
      expr = new Binary(expr, operator, right);
    }
    return expr;
  };

  private factor = (): Expr => {
    let expr = this.unary();
    while (this.match("SLASH", "ASTERISK")) {
      const operator = this.previous();
      const right = this.unary();
      // expr = binaryExpr(expr, operator, right);
      expr = new Binary(expr, operator, right);
    }
    return expr;
  };

  private unary = (): Expr => {
    if (this.match("BANG", "MINUS")) {
      const operator = this.previous();
      const right = this.unary();
      // return unaryExpr(operator, right);
      return new Unary(operator, right);
    }
    return this.call();
  };

  private call = (): Expr => {
    let expr = this.primary();

    while (true) {
      if (this.match("LEFT_PAREN")) {
        expr = this.parseFunctionCall(expr);
      } else if (this.match("DOT")) {
        const name = this.consume("IDENTIFIER", "Except a property name after '.'");
        expr = new Get(expr, name);
      } else break;
    }

    return expr;
  };

  private parseFunctionCall(callee: Expr) {
    const args = [];

    if (!this.check("RIGHT_PAREN")) {
      args.push(this.expression());
      while (this.match("COMMA")) {
        args.push(this.expression());
      }
    }

    const paren = this.consume("RIGHT_PAREN", "Expect ')' after arguments.");

    // return funcExpr(callee, paren, args);
    return new Function(callee, paren, args);
  }

  private primary = (): Expr => {
    if (this.match("FALSE")) return new Literal(false);
    if (this.match("TRUE")) return new Literal(true);
    if (this.match("STRING")) return new Literal(this.previous().literal);
    if (this.match("NIL")) return new Literal(null);
    if (this.match("NUMBER", "FLOAT")) {
      return new Literal(this.previous().literal);
    }
    if (this.match("IDENTIFIER")) {
      return new Variable(this.previous());
    }
    if (this.match("THIS")) return new This(this.previous());
    if (this.match("NEW")) {
      return new Literal(this.previous().lexeme);
    }
    if (this.match("LEFT_PAREN")) {
      const expr = this.expression();
      this.consume("RIGHT_PAREN", "Expect ')' after expression.");
      return new Grouping(expr);
    }

    parseError(this.peek(), "Expect expressionnnnn.");
    throw new ParsingError();
  };

  // Helper method to consume tokens with error handling
  private consume = (type: TokenType, message: string): Token => {
    if (this.check(type)) return this.advance();
    parseError(this.peek(), message);
    throw new ParsingError();
  };
}
