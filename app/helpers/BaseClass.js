"use strict";
const _ = require("underscore");
const Logger = require("./Logger");

class BaseClass {

  constructor(attributes = {}) {
    const classAttributes = _.defaults(this.defaultAttributes, attributes);

    _.each(classAttributes, (value, key) => {
      this[key] = value;
    });

    this.logger = new Logger(classAttributes.loggerName, classAttributes.logLevel);
  }

}

BaseClass.prototype.defaultAttributes = {};

module.exports = BaseClass;
