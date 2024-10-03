import { Callable } from "./Callable";
import { Environment } from "./Environment";
import { Interpreter, LoxInstance } from "./Interpreter";
import { FunctionStmt } from "./Stmt";

export class LoxFunction implements Callable {
  constructor(private declaration: FunctionStmt, public closure: Environment) {}

  call(interpreter: Interpreter, args: any[]): any {
    const environment = new Environment(this.closure);
    args.forEach((arg) => {
      environment.define(arg);
    });

    for (let i = 0; i < args.length; i++) {
      environment.define(this.declaration.params[i].lexeme, args[i]);
    }

    const returnValue = interpreter.executeBlock(this.declaration.body, environment);
    return returnValue;
  }

  bind(instance: LoxInstance) {
    const environment = new Environment(this.closure);
    environment.define("this", instance);
    return new LoxFunction(this.declaration, environment);
  }

  arity(): number {
    return this.declaration.params.length;
  }

  toString(): string {
    return `<fn ${this.declaration.name.lexeme}>`;
  }

  //BLACK-MAGIC
  // Node.js-specific: `util.inspect` method to customize console.log output
  // [Symbol.for("nodejs.util.inspect.custom")]() {
  //   return this.toString();
  // }
}
