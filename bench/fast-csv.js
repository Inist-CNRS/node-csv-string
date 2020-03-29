const CSV = require(__dirname + "/..");

const fs = require("fs");
const stream = fs.createReadStream("./twitter.csv");

const fastcsv = require("fast-csv");

fastcsv(stream, { headers: true })
  .on("data", function (data) {
    process.stdout.write(CSV.stringify(data));
  })
  .parse();
