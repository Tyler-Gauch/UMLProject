const winston = require("winston");

const DEFAULT_LOGGER = "default_logger";

class Logger {

  constructor(props) {
    this.loggerName = props.loggerName;
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

Logger.loggerName = DEFAULT_LOGGER;

module.exports = Logger;