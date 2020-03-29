const CSV = require(__dirname + "/..");

const fs = require("fs");
const csvStream = require("csv-stream").createStream();

fs.createReadStream("./twitter.csv")
  .pipe(csvStream)
  .on("data", function (data) {
    process.stdout.write(CSV.stringify(data));
  });
