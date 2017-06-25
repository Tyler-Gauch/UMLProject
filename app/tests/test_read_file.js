const BaseParser = require("../parsers/BaseParser");
const JavaParser = require("../parsers/JavaParser");
const Logger = require("../helpers/Logger");
const _ = require("underscore");

const displayResult = (result) => {
  if (!result) {
    return;
  }
}

BaseParser.parseFile(process.argv[2], JavaParser).then(function (results) {

});