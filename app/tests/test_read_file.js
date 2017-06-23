const BaseParser = require("../parsers/BaseParser");
const JavaParser = require("../parsers/JavaParser");

BaseParser.parseFile(process.argv[2], JavaParser).then(function (results) {
  console.log(results);
});