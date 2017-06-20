"use strict";

const winston = require("winston");
const _ = require("underscore");
const BaseClass = require("./BaseClass");

class Logger extends BaseClass {

  constructor(attributes = {}) {
    super(attributes);
    winston.level = process.env.LOG_LEVEL;
  }

  error(message, object) {
    winston.log("error", message, object);
  }

  warning(message, object) {
    winston.log("warning", message, object);
  }

  info(message, object) {
    winston.log("info", message, object);
  }

  debug(message, object) {
    winston.log("debug", message, object);
  }

}

Logger.prototype.defaultAttributes = {
  loggerName: "default_logger"
};

return module.exports = Logger;