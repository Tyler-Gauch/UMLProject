"use strict";
const _ = require("underscore");
const Logger = require("./Logger");

class BaseClass {

  constructor(attributes = {}) {
    _.each(attributes, (value, key) => {
      this[key] = value;
    });

    this.logger = new Logger(attributes.loggerName, attributes.logLevel);
  }

}

module.exports = BaseClass;
