"use strict";

const winston = require("winston");
const _ = require("underscore");

class Logger {

  constructor(loggerName = "default_logger", logLevel = process.env.LOG_LEVEL) {
    this.loggerName = loggerName;
    winston.level = logLevel !== undefined ? logLeve : "error";
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

module.exports = Logger;