const BaseParser = require("../parsers/BaseParser");

const parser = new BaseParser({logLevel: "debug"});

parser.parseFile(process.argv[2]).then(function () {

  let currentWord;
  while ((currentWord = parser.getNextWord()) !== null) {
    parser.logger.info("Current Word: '" + currentWord + "' Next Word: '" + parser.viewNextWord() + "'");
  }

})