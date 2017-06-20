"use strict";
const _ = require("underscore");

class BaseClass {

  constructor(attributes = {}) {
    const classAttributes = _.defaults(this.defaultAttributes, attributes);

    _.each(classAttributes, (value, key) => {
      this[key] = value;
    });
  }

};

BaseClass.prototype.defaultAttributes = {};

return module.exports = BaseClass;
