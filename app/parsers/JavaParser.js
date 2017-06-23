const BaseParser = require("./BaseParser");

class JavaParser extends BaseParser {

  parse() {

    while ((this.currentWord = this.getNextKeyWord()) !== null) {
      debugger;
      switch (this.currentWord) {
        case "interface":
          this.results.classType = "interface";
        case "class":
          if (isAbstract) {
            this.results.classType = "abstract";
          }
          if (!results.className) {
            this.results.className = this.sanatize(this.getNextNonKeyWord());
          } else {
            this.parseSubClass();
          }
          break;
        case "extends":
          this.results.relationships.inherits.push(this.sanatize(this.getNextWord()));
          break;
        case "private":
        case "public":
        case "protected":
          this.lastVisibility = this.currentWord;
          this.isAbstract = false;
          this.isFinal = false;
          this.isStatic = false;
          this.parseStatement();
          break;
        case "abstract":
          this.isAbstract = true;
          this.parseStatement();
          break;
        case "final":
          this.isFinal = true;
          this.parseStatement();
          break;
        case "static":
          this.isStatic = true;
          this.parseStatement();
          break;
        case "package":
          this.results.package = this.sanatize(this.getNextNonKeyWord());
          break;
        case "import":
          let ref = this.getNextNonKeyWord();
          ref = ref.substring(ref.lastIndexOf(".") + 1).replace(this.statementSeparator, "").replace(";", "");
          if (!this.results.relationships.references.includes(ref)) {
            this.results.relationships.references.push(ref);
          }
          break;
        case "implements":
          let temp = this.getNextNonKeyWord();
          let list = temp;
          while (temp.indexOf(",") >= 0) {
            temp = this.getNextNonKeyWord();
            list += temp;
          }

          list = list.replace("{", "");
          list.split(",").each((Iface) => {
            if (!this.results.relationships.implements.includes(Iface)) {
              this.results.relationships.implements.push(Iface);
            }
          });
          break;
        default:
          break;
      }
    }

    return this.results;
  }

  parseSubClass() {
    this.iterator -= "class".length;
    const startIndex = this.iterator;
    let braceCount = 1;
    let currentChar;

    for (this.iterator = this.fileContents.indexOf("{", this.iterator) + 1; this.iterator < this.fileContents.length; this.iterator++) {
      this.eatWhiteSpace();
      currentChar = this.fileContents.charAt(this.iterator);

      if (currentChar === "{") {
        braceCount++;
      } else if (currentChar == "}") {
        braceCount--;
      }

      if (braceCount === 0) {
        this.iterator++;
        break;
      }
    }
    const end = this.iterator;
    parser = new JavaParser({
      fileContents: this.fileContents.substring(start - 1, end + 1)
    });
    parser.parse();
    parser.results.relationships.aggregation.push(this.results.className);
    this.results.nestedClasses.push(parser.results);
  }

  parseStatement() {

    // check if we are at a statment and if not return
    // we want to continue parsing key words if we have a statement like
    // public static final float A = 0; if the current word is public we want
    // to keep parsing the static and the float in the master switch case
    debugger;
    if (this.isKeyWord(this.viewNextWord())) {
      return;
    }

    this.currentWord = this.getNextWord();
    let nextWord = this.viewNextWord();
    const currentWordHasParen = this.currentWord.indexOf("(") >= 0;
    const nextWordHasParen = nextWord.indexOf("(") >= 0;
    let attributes;

    if (currentWordHasParen || nextWordHasParen) {
      this.parseFunction(this.currentWord, nextWord);
    } else if ((attributes = this.isAttributes(this.currentWord)) !== null) {
      attributes.each((attribute) => {
        if (!this.results.relationships.references.includes(this.currentWord)) {
          this.results.relationships.references.push(this.currentWord);
        }

        this.attributes.push({
          name: attribute.name,
          visibility: this.lastVisibility,
          type: this.currentWord,
          default: attribute.default,
          isStatic: this.isStatic,
          isAbstract: this.isAbstract,
          isFinal: this.isFinal
        });
      });
    }
  }

  parseFunction(currentWord, nextWord) {
    let hasParameters = true;
    let parameters = "";
    let name;
    const currentWordHasParen = currentWord.indexOf("(") >= 0;
    const nextWordHasParen = nextWord.indexOf("(") >= 0;

    // handels the case where we are dealing with a constructor so
    // the type and the name are the same
    let type = name.substring(0, currentWord.indexOf("("));

    if (currentWordHasParen) {
      name = type;
      parameters += currentWord.substring(currentWord.indexOf("(") + 1);
      if (this.currentWord.indexOf(")") >= 0) {
        hasParameters = false;
      }
    } else if (nextWordHasParen) {
      // actually move it if it contains the paren
      nextWord = this.getNextWord();
      name = nextWord.substring(0, nextWord.indexOf("("));
      parameters += nextWord.substring(nextWord.indexOf("(") + 1);

      if (nextWord.indexOf(")") >= 0) {
        hasParameters = false;
      }
    }

    // we need to loop through all the words until we find the closing )
    if (hasParameters) {
      let temp;
      while ((temp = this.getNextWord()) !== null) {
        if (temp.indexOf(")") >= 0) {
          parameters += temp.substring(0, temp.indexOf(")"));
          break;
        } else {
          parameters += temp;
        }
      }
    }

    const paramTypes = [];
    parameters.split(",").each((param) => {
      const splitParam = param.split(" ");
      paramTypes.push(splitParam[0]);
    });

    const func = {
      name: name,
      visiblity: this.lastVisibility,
      isStatic: this.isStatic,
      isFinal: this.isFinal,
      isAbstract: this.isAbstract,
      parameterTypes: paramTypes
    };

    if (name !== this.results.className) {
      func.type = type;
      if (!this.results.relationships.references.includes(type)) {
        this.results.relationships.references.push(type);
      }
    }

    this.results.functions.push(func);

    // now that we are at a function we want to eat through the function code to get passed it
    //first lets back up the iterator a little bit to make sure that we can start at the first {
    this.iterator -= func.name.length;
    let braceCount = 1;
    for (this.iterator = this.fileContents.indexOf("{", this.iterator); this.iterator < this.fileContents.length; this.iterator++) {
      this.eatWhiteSpace();
      const currentChar = this.fileContents.charAt(this.iterator);
      if (currentChar === "{") {
        braceCount++;
      } else if (currentChar === "}") {
        braceCount--;
      }

      if (braceCount === 0) {
        this.iterator++;
        break;
      }
    }
  }

  isAttributes(currentWord) {
    //in order to see if we have an attribute we need to check for a few conditions
		//1) name;
		//2) name1, name2,...nameN;
		//3) name=0;
		//4) name =0;
		//5) name = 0;
		//6) name= 0;
		//7) name = new Object();
		//8) name= new Object();
		//9) name=new Object();
		//10) name =new Object();
		//11) name[] = new int[];
		//12) name[]= new int[];
		//13) name[] =new int[];
		//14) name[]=new int[];
		//15) name[]''new int[]{....};

    if (currentWord.indexOf(";") >= 0) {
      return [{
        name: this.sanatize(this.getNextWord()), // double check this
        default: null
      }];
    }

    // now we want to get everything up to the next ;
    const statment = this.viewNextStatement();

    //check if we have multiple attributes on the same line
    if (/.*(,.*)(;)/.test(statement)) {
      const response = [];

      statement.split(",").each((attrDef) => {
        const splitDef = attrDef.split("=");
        let def = null;
        if(splitDef.length > 1) {
          def = splitDef[1];
        }
        response.push({
          name: this.sanatize(splitDef[0]),
          default: def
        });
      });

      return response;
    }

    // covers 3 -> 15
    if (/[^,]+(=)?[^,]+(;)/.test(statement)) {
      const splitDef = attrDef.split("=");
      let def = null;
      if (splitDef.length > 1) {
        def = splitDef[1];
      }
      return [{
        name: this.sanatize(splitDef[0]),
        default: def
      }];
    }
  }
}

JavaParser.prototype.defaultAttributes = {
  results: {
    className: null,
    classType: "class",
    functions: [],
    attributes: [],
    relationships: {
      implements: [],
      inherits: [],
      references: [],
      aggregation: [],
      compositeAggregation: []
    },
    package: null,
    nestedClasses: []
  },
  currentWord: null,
  lastVisibility: null,
  isAbstract: false,
  isFinal: false,
  isStatic: false,
  keywords: [
    "class",
    "public",
    "private",
    "static",
    "final",
    "package",
    "import",
    "protected",
    "abstract",
    "interface",
    "extends",
    "implements",
    "enum"
  ],
  commentRegex: [
    // /**/ comments
    /\/\*[\s\S]*?\*\//g,
    // // comments
    /\/\/.*\n/g,
  ],
  sanatizeRegex: /(\s|\[|\]|\{|\}|=|,)+/g,
  parseableFileExtensions: ["java"] // by default we have no parse function so we can't parse anything
};

module.exports = JavaParser;