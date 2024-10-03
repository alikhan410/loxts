import { Token } from "./Token";
import { RuntimeError } from "./errorHandling";

export class Environment {
  public map = new Map<string, any>();
  public enclosing: Environment | null;

  constructor(enclosing: Environment | null = null) {
    this.enclosing = enclosing;
  }

  public define(name: string, value: any = null): void {
    this.map.set(name, value);
  }

  public assign(name: Token, value: any): void {
    if (this.map.has(name.lexeme)) {
      this.map.set(name.lexeme, value);
      return;
    }

    if (this.enclosing !== null) {
      this.enclosing.assign(name, value);
      return;
    }

    throw new RuntimeError(name, `Undefined variable '${name.lexeme}'`);
  }

  public get(name: Token): any {
    // console.log(this.map.get(name.lexeme));
    if (this.map.has(name.lexeme)) {
      return this.map.get(name.lexeme);
    }

    if (this.enclosing !== null) {
      return this.enclosing.get(name);
    }

    throw new RuntimeError(name, `Undefined variable '${name.lexeme}'.`);
  }

  public getAt(distant: number, name: Token) {
    if (distant === 0) return this.get(name);

    let currentEnclosing: Environment = this;
    for (let i = 0; i < distant; i++) {
      currentEnclosing = currentEnclosing.enclosing as Environment;
    }
    return currentEnclosing.get(name);
  }
}
