To see the full guide visit this [Link](https://github.com/alikhan410/jlox)

# Loxts

Loxts is a TypeScript implementation of the Lox programming language. Lox is a dynamically typed language created by Robert Nystrom. This project aims to provide a clear and efficient implementation of the language using modern TypeScript features.

## Features

- **Dynamic Typing**: Loxts supports dynamic typing, allowing variables to hold any type of value.
- **First-Class Functions**: Functions in Loxts are first-class citizens, meaning they can be assigned to variables, passed as arguments, and returned from other functions.
- **Control Flow Statements**: Loxts includes `if`, `else`, and `while` control flow statements.
- **User-Friendly Error Handling**: Provides meaningful error messages to help with debugging.
- **Standard Library**: A collection of built-in functions and libraries to facilitate common tasks.

## Installation

To get started with Loxts, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/loxts.git
   cd lox
   cd src
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

## Usage

You can run the interpreter with a specific Lox file:

```bash
ts-node -- path/to/yourfile.lox
```

## Examples

Here are some simple examples of Lox code:

### Hello World

```lox
print "Hello, World!";
```

### Fibonacci Function

```lox
fun fib(n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

print fib(10);
```
