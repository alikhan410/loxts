import { Token } from "./Token";

export let hadError = false;
export let hadRuntimeError = false;

export class RuntimeError extends Error {
  public token;
  constructor(token: Token, message: string) {
    super(message);
    this.token = token;
  }
}

export class ParsingError extends Error {}

export function handleRuntimeError(exception: RuntimeError) {
  logRuntimeError(exception.token.line, exception.message);
}

export function parseError(token: Token, message: string) {
  // console.log(token);
  if (token.type === "EOF") {
    logParsingError(token.line, "at end", message);
  } else {
    logParsingError(token.line, "at '" + token.lexeme + "'", message);
  }
}

export function logParsingError(line: number, where: string, message: string) {
  console.log(`[line: ${line}] Error ${where}: ${message}`);
  hadError = true;
}

export function logRuntimeError(line: number, message: string) {
  console.log(`${message}\n[line ${line}]`);
  hadRuntimeError = true;
}
