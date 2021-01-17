const { isNumber } = require('util');
const Lox = require('./Lox');
const Token = require('./Token');
const TokenType = require('./TokenType');

class Scanner {
  constructor(src) {
    this.src = src;
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      // we're beginning of next lexemme
      this.start = this.current;
      this.scanToken();
    }
    this.tokens.push(new Token(TokenType.EOF, '', null, this.line));
    return this.tokens;
  }

  isDigit(char) {
    return !isNaN(parseInt(char, 10));
  }

  parseNumber() {
    while (this.isDigit(this.peek())) {
      this.advance();
    }
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      this.advance();

      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }
    this.addToken(TokenType.NUMBER, this.src.substring(this.start, this.current));
  }

  // identify the token
  scanToken() {
    const char = this.advance();
    switch (char) {
      case '(':
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ')':
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case '{':
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case '}':
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case ',':
        this.addToken(TokenType.COMMA);
        break;
      case '.':
        this.addToken(TokenType.DOT);
        break;
      case '+':
        this.addToken(TokenType.PLUS);
        break;
      case ';':
        this.addToken(TokenType.SEMICOLON);
        break;
      case '*':
        this.addToken(TokenType.STAR);
        break;
      case '!':
        this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case '=':
        this.addToken(
          this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
        );
        break;
      case '>':
        this.addToken(
          this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER
        );
        break;
      case '<':
        this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case '/':
        if (this.match('/')) {
          // it is a comment
          while (this.peek() !== '\n' && !this.isAtEnd()) this.advance();
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace.
        break;

      case '\n':
        this.line++;
        break;
      default:
        if (this.isDigit(char)) {
          this.parseNumber();
        }
        // Lox.error(this.line, "Unexpected character");
        break;
    }
  }

  peek() {
    if (this.isAtEnd()) return '\0';
    return this.src.charAt(this.current);
  }

  peekNext() {
    if (this.current + 1 > this.src.length) return '\0';
    return this.src.charAt(this.current + 1);
  }

  match(expectedChar) {
    if (this.isAtEnd()) return false;
    if (this.src.charAt(this.current) !== expectedChar) return false;
    this.current++;
    return true;
  }

  advance() {
    this.current++;
    return this.src.charAt(this.current - 1);
  }

  addToken(tokenType, literal) {
    const text = this.src.substring(this.start, this.current);
    this.tokens.push(new Token(tokenType, text, literal, this.line));
  }

  isAtEnd() {
    return this.current >= this.src.length;
  }
}

module.exports = Scanner;
