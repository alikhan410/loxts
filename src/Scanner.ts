import { parseError, ParsingError } from "./errorHandling";
import { Token, TokenType } from "./Token";
enum Keywords {
  CLASS = "CLASS",
  FUN = "FUN",
  VAR = "VAR",
  CONST = "CONST",
  FOR = "FOR",
  FALSE = "FALSE",
  TRUE = "TRUE",
  IF = "IF",
  ELSE = "ELSE",
  LET = "LET",
  WHILE = "WHILE",
  PRINT = "PRINT",
  RETURN = "RETURN",
  NIL = "NIL",
  NEW = "NEW",
  DOT = "DOT",
  THIS = "THIS",
}
class Scanner {
  readonly tokens: Token[] = [];

  start = 0;
  current = 0;
  source: string;
  line = 1;

  constructor(source: string) {
    this.source = source;
  }

  public scanTokens = (): void => {
    while (!this.isAtEnd()) {
      // this.start = this.current;
      this.scanToken();
    }
    this.tokens.push(new Token("EOF", "", this.line));
  };

  private scanToken = (): void => {
    let lexeme;
    const c = this.peek();
    // console.log(`pointer at ${c}`);
    this.current++;

    switch (c) {
      case "=":
        lexeme = this.match("=") ? "==" : "=";
        this.addToken(lexeme === "==" ? "EQUAL_EQUAL" : "EQUAL", lexeme);
        break;
      case "!":
        lexeme = this.match("=") ? "!=" : "!";
        this.addToken(lexeme === "!=" ? "BANG_EQUAL" : "BANG", lexeme);

        break;
      case ">":
        lexeme = this.match("=") ? ">=" : ">";
        this.addToken(lexeme === ">=" ? "GREATER_EQUAL" : "GREATER", lexeme);
        break;
      case "<":
        lexeme = this.match("=") ? "<=" : "<";
        this.addToken(lexeme === "<=" ? "LESSER_EQUAL" : "LESSER", lexeme);
        break;
      case "+":
        this.addToken("PLUS", "+");
        break;
      case "-":
        this.addToken("MINUS", "-");
        break;
      case "*":
        this.addToken("ASTERISK", "*");
        break;
      case "|":
        lexeme = this.match("|") ? "||" : "|";
        this.addToken(lexeme === "||" ? "LOGICAL_OR" : "BITWISE_OR", lexeme);
        break;
      case "&":
        lexeme = this.match("&") ? "&&" : "&";
        this.addToken(lexeme === "&&" ? "LOGICAL_AND" : "BITWISE_AND", lexeme);
        break;
      case "(":
        this.addToken("LEFT_PAREN", "(");
        break;
      case ")":
        this.addToken("RIGHT_PAREN", ")");
        break;
      case "{":
        this.addToken("LEFT_BRACE", "{");
        break;
      case "}":
        this.addToken("RIGHT_BRACE", "}");
        break;
      case ";":
        this.addToken("SEMICOLON", ";");
        break;
      case ",":
        this.addToken("COMMA", ",");
        break;
      case ".":
        this.addToken("DOT", ".");
        break;
      case "/":
        if (this.match("/")) {
          while (this.peek() != "\n" && !this.isAtEnd()) {
            this.current++;
          }
          break;
        }
        this.addToken("SLASH", "/");
        break;
      case '"':
        this.start = this.current - 1;

        this.isString();
        break;
      case " ":
        break;
      case "\t":
        break;
      case "\n":
        this.line++;
        break;
      case "\r":
        break;
      default:
        if (this.isAlpha(c)) {
          this.start = this.current - 1;
          this.processIdentifier();
          break;
        }
        if (this.isNumeric(c)) {
          this.start = this.current - 1;
          this.processNumber();
          break;
        }
        parseError(this.tokens[this.tokens.length - 1], `Unidentified character: ${c}`);
        throw new ParsingError();
    }
  };

  private addToken(type: TokenType, lexeme: string, literal?: any) {
    this.tokens.push(new Token(type, lexeme, this.line, literal));
  }

  private isAlpha = (char: string) => {
    return (char >= "A" && char <= "Z") || (char >= "a" && char <= "z");
  };

  private isNumeric = (char: string) => {
    const i = parseInt(char);
    return i >= 0 && i <= 9;
  };

  private isAlphaNumeric = (char: string) => {
    return this.isAlpha(char) || this.isNumeric(char);
  };

  private isString = () => {
    if (this.current > this.source.length - 1) return;

    while (this.peek() != '"' && !this.isAtEnd()) {
      this.current++;
    }

    if (!this.match('"')) {
      const str = this.source.substring(this.start, this.start + 3) + "...";
      this.addToken("STRING", str);
      parseError(this.tokens[this.tokens.length - 1], 'Missing "');
      throw new ParsingError();
    }

    // Include the closing quote in the substring
    const strLexeme = this.source.substring(this.start, this.current);
    const strLiteral = this.source.substring(this.start + 1, this.current - 1);
    // console.log(str);
    // this.current++; // Skip the closing quote
    this.addToken("STRING", strLexeme, strLiteral);
  };

  private processIdentifier = () => {
    // Continue processing until the end of the string or a space is found
    while (!this.isAtEnd() && this.peek() !== " " && this.isAlphaNumeric(this.source[this.current])) {
      this.current++;
    }

    const str = this.source.substring(this.start, this.current);

    //I'M SORRY FOR THIS CODE
    if (Object.values(Keywords).includes(str.toUpperCase() as Keywords)) {
      this.addToken(Keywords[str.toUpperCase() as Keywords], str);
      return;
    }
    this.addToken("IDENTIFIER", str);
  };

  private processNumber = () => {
    while (!this.isAtEnd() && this.isNumeric(this.peek())) {
      this.current++;
    }

    let isFloat = false;

    if (this.peek() === ".") {
      isFloat = true;
      // Skip the dot "."
      this.current++;

      // Parse the fractional part
      while (!this.isAtEnd() && this.isNumeric(this.peek())) {
        this.current++;
      }
    }

    const numStr = this.source.substring(this.start, this.current);
    const numLiteral = isFloat ? parseFloat(numStr) : parseInt(numStr, 10);

    this.addToken(isFloat ? "FLOAT" : "NUMBER", numStr, numLiteral);
  };

  private isAtEnd = (): boolean => {
    return this.current >= this.source.length;
  };

  match = (expected: string): boolean => {
    if (!this.isAtEnd() && this.peek() === expected) {
      this.current++;
      return true;
    } else {
      return false;
    }
  };

  private peek = (): string => {
    return this.source[this.current];
  };
}
export = Scanner;
