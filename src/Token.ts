export type TokenType =
  // Keywords
  | "CLASS"
  | "FUN"
  | "CONST"
  | "LET"
  | "VAR"
  | "FOR"
  | "IF"
  | "ELSE"
  | "WHILE"
  | "PRINT"
  | "RETURN"
  | "NEW"
  | "DOT"
  | "THIS"

  // Literals
  | "IDENTIFIER"
  | "STRING"
  | "NUMBER"
  | "FLOAT"
  | "NIL"

  // Operators and Punctuation
  | "PLUS"
  | "MINUS"
  | "DIVIDE"
  | "ASTERISK"
  | "SLASH"
  | "EQUAL"
  | "EQUAL_EQUAL"
  | "BANG_EQUAL"
  | "GREATER"
  | "GREATER_EQUAL"
  | "LESSER"
  | "LESSER_EQUAL"
  | "BANG"
  | "BITWISE_AND"
  | "BITWISE_OR"
  | "LOGICAL_OR"
  | "LOGICAL_AND"
  | "SEMICOLON"
  | "LEFT_PAREN"
  | "RIGHT_PAREN"
  | "LEFT_BRACE"
  | "RIGHT_BRACE"
  | "COMMA"

  // Booleans
  | "TRUE"
  | "FALSE"

  // Miscellaneous
  | "EOF";

export class Token {
  readonly type: TokenType;
  readonly lexeme: string;
  readonly literal: any;
  readonly line: number;

  constructor(type: TokenType, lexeme: string, line: number, literal?: any) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }
}
