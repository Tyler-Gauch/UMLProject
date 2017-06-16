const ncp = require("ncp");
const logger = require("../helpers/logger");

const BASE_DIR = __dirname + "/..";
const GIT_HOOKS = BASE_DIR + "/git_hooks";
const GIT_DIR = BASE_DIR + "/.git/hooks";


ncp(GIT_HOOKS, GIT_DIR, err => {
    if (err) {
        return logger.error("Failed to copy '" + GIT_HOOKS + "' to '" + GIT_DIR + "'", err);
    }
    logger.info("Git hooks installed.");
});