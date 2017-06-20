"use strict";
const BaseClass = require("../helpers/BaseClass");

class BaseParser extends BaseClass {

  constructor(attributes = {}) {
    super(attributes);
  }

}

BaseParser.prototype.defaultAttributes = {
  fileContents: "",
  keywords: [],
  statementSeparator: ";"
};

module.exports = BaseParser;