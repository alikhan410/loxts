import { readFileSync } from "fs";
import path = require("path");
import { hadError } from "./errorHandling";
import { Interpreter } from "./Interpreter";
import { Parser } from "./Parser";
import { Resolver } from "./Resolver";
import Scanner = require("./Scanner");

function main() {
  const args = process.argv.slice(2); // Slice to remove 'node' and the script path

  if (args.length === 0) {
    console.error("Opening interactive session...");
    // TODO: Open interactive session logic here
  } else if (args.length > 1) {
    console.error("Too many arguments. Exiting.");
    process.exit(64);
  } else if (args.length === 1) {
    const startTime = performance.now();

    runFile(args[0]);

    const endTime = performance.now();
    const executionTime = (endTime - startTime).toFixed(2);

    if (hadError) {
      console.log("Code didn't run due to an error.");
      return;
    }

    console.log(`Code executed successfully in ${executionTime}ms.`);
  }
}

function runFile(fileName: string) {
  // Create a path to the file in the current directory
  const filePath = path.join(__dirname, fileName);
  // try {
  const contents = readFileSync(filePath, "utf-8"); // Specify encoding directly here
  const sct = new Scanner(contents);
  sct.scanTokens();
  // console.log(sct.tokens);
  const parser = new Parser(sct.tokens);
  const statements = parser.parse();
  // console.log(JSON.stringify(statements, null, 2));
  const i = new Interpreter();
  const resolver = new Resolver(i);
  resolver.resolve(statements);

  // console.log(i.local.values());
  i.interpret(statements);
  // } catch (error: unknown) {
  //   if (error instanceof Error) {
  //     console.error("Error reading file: ", error.message);
  //   }
  // }
}

main();
