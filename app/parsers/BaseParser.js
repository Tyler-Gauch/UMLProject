"use strict";
const fs = require("fs");
const _ = require("underscore");
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