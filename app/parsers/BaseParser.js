"use strict";
const BaseClass = require("../helpers/BaseClass");
const BlueBirdPromise = require("bluebird");
const fs = BlueBirdPromise.promisifyAll(require("fs"));

class BaseParser extends BaseClass {

  constructor(attributes = {}) {
    super(attributes);
  }

  parse() {
    throw new Error("Parse function not implemented");
  }

  findNextKeyWord() {

  }

  findNextNonKeyword() {

  }

  getNextStatement() {

  }

  /**
   * This parses out the next word and moves the iterator forward
   * until the file is empty. To just look at what the next word is
   * use viewNextWord
   */
  getNextWord() {
    let nextWord = null;
    this.iterator = this.eatWhiteSpace(this.iterator);

    for (this.iterator; this.iterator < this.fileContents.length; this.iterator++) {
      const currentChar = this.fileContents.charAt(this.iterator);
      if (this.isWhiteSpaceCharacter(currentChar)) {
        return nextWord;
      } else if (nextWord === null) {
        nextWord = currentChar;
      } else {
        nextWord += currentChar;
      }
    }

    return nextWord;
  }


  /**
   * This works just like getNextWord however it doesnt move the iterator forward
   * meaning that each call to viewNextWord will return the same thing. To move the
   * iterator forward use getNextWord
   */
  viewNextWord() {
    let nextWord = null;
    let iterator = this.eatWhiteSpace(this.iterator);

    for (iterator; iterator < this.fileContents.length; iterator++) {
      const currentChar = this.fileContents.charAt(iterator);
      if (this.isWhiteSpaceCharacter(currentChar)) {
        return nextWord;
      } else if (nextWord === null) {
        nextWord = currentChar;
      } else {
        nextWord += currentChar;
      }
    }

    return nextWord;
  }

  isKeyWord() {

  }

  /**
   * Moves the iterator forward while there is still whitespace characters
   */
  eatWhiteSpace(index) {

    for (index; index < this.fileContents.length; index++) {
      if (!this.isWhiteSpaceCharacter(this.fileContents.charAt(index))) {
        break;
      }
    }
    return index;
  }

  /**
   * Checks if the provided character is a whitespace character
   */
  isWhiteSpaceCharacter(char) {
    return /\s/.test(char);
  }

  /**
   * Is called on the initial load of the file
   * replaces all strings matched in this.santizeRegex
   * with a single space. This should have regex for
   */
  sanitizeFileBuffer(fileBuffer) {
    return new BlueBirdPromise((resolve, reject) => {
      for (let i = 0; i < this.commentRegex.length; i++) {
        fileBuffer = fileBuffer.replace(this.commentRegex[i], " ");
      }
      if (this.collapseWhiteSpace) {
        fileBuffer = fileBuffer.replace(this.whiteSpaceRegex, " ");
      }
      resolve(fileBuffer);
    });
  }

  parseDirectory() {

  }

  parseFile(fileName) {
    return fs.readFileAsync(fileName, "utf8")
      .then((fileBuffer) => {
        return this.sanitizeFileBuffer(fileBuffer);
      })
      .then((fileBuffer) => {
        this.fileContents = fileBuffer;
      });
  }

  parseLine() {

  }

  getUMLInfo() {

  }

  sanatize() {

  }
}

BaseParser.prototype.defaultAttributes = {
  fileContents: "",
  keywords: [
    "class",
    "public",
    "private",
    "static",
    "final",
    "package",
    "import",
    "protected",
    "abstract",
    "interface",
    "extends",
    "implements",
    "enum"
  ],
  statementSeparator: ";",
  iterator: 0,
  commentRegex: [
    // /**/ comments
    /\/\*[\s\S]*?\*\//g,
    // // comments
    /\/\/.*\n/g,
  ],
  whiteSpaceRegex: /[\s]+/g,
  collapseWhiteSpace: true //set to false for languages like Python that use whitespace as formatting
};

module.exports = BaseParser;