export class Lexer {
  constructor(source) {
    this.source = source;
    this.index = 0;
    this.savedIndex = 0;
    this.length = source.length;

    this.isNewLine = true;
    this.savedIsNewLine = true;
  }

  isEOF() {
    return this.index >= this.length;
  }

  peekChar() {
    if (this.isEOF()) return "";
    return this.source[this.index];
  }

  readChar() {
    if (this.isEOF()) return "";

    const char = this.source[this.index++];
    this.isNewLine = char === "\n";

    return char;
  }

  consumeWhiteSpaces() {
    let currChar = this.peekChar();

    while (!this.isEOF() && currChar !== "\n" && currChar.trim() === "") {
      this.readChar();
      currChar = this.peekChar();
    }
  }

  save() {
    this.savedIndex = this.index;
    this.savedIsNewLine = this.isNewLine;
  }

  restore() {
    this.index = this.savedIndex;
    this.isNewLine = this.savedIsNewLine;
  }
}
