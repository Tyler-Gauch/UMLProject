"use strict";
const BaseClass = require("../helpers/BaseClass");
const BlueBirdPromise = require("bluebird");
const fs = BlueBirdPromise.promisifyAll(require("fs"));
const Logger = require("../helpers/logger");
const _ = require("underscore");

class BaseParser extends BaseClass {

  constructor(attributes = {}) {
    super(_.extend(BaseParser.prototype.defaultAttributes, attributes));
    this.iterator = 0;

    this.sanitizeFileContents();
  }

  /**
   * This function must be implemented by child classes
   */
  parse() {
    throw new Error("Parse function not implemented");
  }

  /**
   * Retrieves the next keyword from the file moving the iterator forward
   */
  getNextKeyWord() {
    let currentWord;
    while ((currentWord = this.getNextWord()) !== null) {
      if (this.isKeyWord(currentWord)) {
        break;
      }
    }
    return currentWord;
  }

  /**
   * Runs getNextKeyWord without moving the iterator
   */
  viewNextKeyWord() {
    return this._moveIteratorTemporarily(this.getNextKeyWord);
  }

  /**
   * Retrieves the next non keyword in the file moving the iterator forward
   */
  getNextNonKeyWord() {
    let currentWord;
    while ((currentWord = this.getNextWord()) !== null) {
      if (!this.isKeyWord(currentWord)) {
        break;
      }
    }
    return currentWord;
  }

  /**
   * Runs getNextNonKeyWord without moving the iterator
   */
  viewNextNonKeyWord() {
    return this._moveIteratorTemporarily(this.getNextNonKeyWord);
  }

  /**
   * Retrieves the next full statement available. A statement is considered a set of characters
   * up to teh this.statementSeperator character
   */
  getNextStatement() {
    let statement = null;
    this.eatWhiteSpace();
    for (this.iterator; this.iterator < this.fileContents.length; this.iterator++) {
      const currentChar = this.fileContents.charAt(this.iterator);
      statement += currentChar;
      if (this.statementSeparator.test(currentChar)) {
        break;
      }
    }

    return statement;
  }

  /**
   * Runs getNextStatement without moving the Iterator
   */
  viewNextStatement() {
    return this._moveIteratorTemporarily(this.getNextStatement);
  }

  /**
   * This parses out the next word and moves the iterator forward
   * until the file is empty. To just look at what the next word is
   * use viewNextWord
   */
  getNextWord() {
    let nextWord = null;
    this.eatWhiteSpace();

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
   * Runs getNextWord without moving the iterator
   */
  viewNextWord() {
    return this._moveIteratorTemporarily(this.getNextWord);
  }

  /**
   * Checks if the given string is a keyword
   *
   * @param {string} word
   */
  isKeyWord(word) {
    return this.keywords.indexOf(word) >= 0;
  }

  /**
   * Moves the iterator forward while there is still whitespace characters
   */
  eatWhiteSpace() {
    for (this.iterator; this.iterator < this.fileContents.length; this.iterator++) {
      if (!this.isWhiteSpaceCharacter(this.fileContents.charAt(this.iterator))) {
        break;
      }
    }
  }

  /**
   * Checks if the provided character is a whitespace character
   */
  isWhiteSpaceCharacter(char) {
    return /\s/.test(char);
  }

  /**
 * Removes formatting symbols from the word sucha s (), {}, and []
 *
 * @param {string} word
 */
  sanatize(word) {
    if (!this.sanatizeRegex) {
      return word;
    }
    return word.replace(this.sanatizeRegex, "");
  }

  /**
   * Executes a given function without moving the iternal iterator
   *
   * @param {function} getFunction
   */
  _moveIteratorTemporarily(getFunction) {
    //scope the getFunction
    getFunction = getFunction.bind(this);
    const currentIterator = this.iterator;
    const response = getFunction();
    this.iterator = currentIterator;
    return response;
  }

  /**
 * Is called on the initial load of the file
 * replaces all strings matched in this.commentRegex
 * with a single space and collapses whitespace if this.collapseWhiteSpace is true
 */
  sanitizeFileContents() {
    for (let i = 0; i < this.commentRegex.length; i++) {
      this.fileContents = this.fileContents.replace(this.commentRegex[i], " ");
    }

    if (this.collapseWhiteSpace === true) {
      this.fileContents = this.fileContents.replace(this.whiteSpaceRegex, " ");
    }
  }


  ////////////////////////////////////////////
  // The below functions are static methods //
  ////////////////////////////////////////////

  static parseDirectory(directoryName, ParserConstructor) {
    return fs.readdirAsync(directoryName).then((files) => {
      const promises = files.map((file) => {
        return new BlueBirdPromise((resolve) => {
          resolve(BaseParser.parseFile(directoryName + "/" + file, ParserConstructor));
        });
      });

      return Promise.all(promises);
    });
  }

  /**
   * Parses the given filename for UML metadata
   *
   * @param {string} fileName
   */
  static parseFile(fileName, ParserConstructor) {
    return fs.lstatAsync(fileName)
      .then(stats => {
        if (stats.isDirectory()) {
          return BaseParser.parseDirectory(fileName, ParserConstructor);
        } else if (ParserConstructor.isParseableFile(fileName)) {
          return fs.readFileAsync(fileName, "utf8")
            .then((fileBuffer) => {
              const parser = new ParserConstructor({ fileContents: fileBuffer });
              return parser.parse();
            });
        } else {
          return null;
        }
      })
      .catch(err => {
        /**
         * this catches any errors if something weird is happening
         * try uncommenting the line below
         */
        (new Logger()).error(err);
      });
  }

  /**
   * Checks if the file is parse able according to the
   * this.parseableFileExtensions array
   */
  static isParseableFile(fileName) {
    return this.prototype.defaultAttributes.parseableFileExtensions.indexOf(fileName.split(".").pop()) >= 0;
  }

  getUMLInfo() {

  }
}

BaseParser.prototype.defaultAttributes = {
  fileContents: "",
  keywords: [],
  statementSeparator: /;/, //most languages use ; so might as well be default
  iterator: 0,
  commentRegex: [],
  whiteSpaceRegex: /[\s]+/g,
  collapseWhiteSpace: true, //set to false for languages like Python that use whitespace as formatting
  sanatizeRegex: null,
  parseableFileExtensions: [] // by default we have no parse function so we can't parse anything
};

module.exports = BaseParser;