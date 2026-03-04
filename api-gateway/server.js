const path = require("path");
const gateway = require("express-gateway");

gateway().load(require("path").join(__dirname, "config")).run();
