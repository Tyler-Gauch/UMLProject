const ncp = require("ncp");
const Logger = require("./app/helpers/Logger");

const GIT_HOOKS = __dirname + "/git_hooks";
const GIT_DIR = __dirname + "/.git/hooks";

const logger = new Logger("setup");

ncp(GIT_HOOKS, GIT_DIR, err => {
  if (err) {
    return logger.error("Failed to copy '" + GIT_HOOKS + "' to '" + GIT_DIR + "'", err);
  }
  logger.info("Git hooks installed.");
});