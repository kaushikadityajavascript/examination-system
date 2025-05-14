const path = require("path");
const fs = require("fs");
const yaml = require("yamljs"); // Use yamljs, not js-yaml

const swaggerDocument = yaml.load(path.join(__dirname, "./swagger.yaml"));

module.exports = swaggerDocument;
