const ncp = require("ncp");

const BASE_DIR = __dirname + "/..";
const GIT_HOOKS = BASE_DIR + "/git_hooks";
const GIT_DIR = BASE_DIR + "/.git/hooks";


ncp(GIT_HOOKS, GIT_DIR, err => {
    if (err) {
        return console.error(err);
    }
    console.log("Git hooks installed.");
});