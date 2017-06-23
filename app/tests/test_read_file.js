const BaseParser = require("../parsers/BaseParser");
const JavaParser = require("../parsers/JavaParser");
const Logger = require("../helpers/Logger");

BaseParser.parseFile(process.argv[2], JavaParser).then(function (results) {
  (new Logger).info(results);
});