const fs = require('fs');
const { stdin } = require('process');
const Scanner = require('./Scanner');

class Lox {
  runFile(path) {
    fs.readFile(path, (err, source) => {
      if (err) {
        console.error('error reading file');
        return;
      }
      this.run(String(source));
      // handle error and runtime error
    });
  }

  runPrompt() {
    console.log('>>');
    stdin.addListener('data', (data) => {
      this.run(String(data));
    });
  }

  run(src) {
    const scanner = new Scanner(src);
    const tokens = scanner.scanTokens();

    for (const token of tokens) {
      console.log(token);
    }
  }

  main() {
    const args = process.argv;
    if (args.length > 3) {
      console.log('Usage lox [script]');
      console.log(...args)
      process.exit(64);
    } else if (args.length === 3) {
      this.runFile(args[2]);
    } else {
      this.runPrompt();
    }
  }
}

module.exports = Lox;
