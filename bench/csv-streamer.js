const CSV = require(__dirname + "/..");

const fs = require("fs");
const CSVStream = require("csv-streamer");
const csvs = new CSVStream({ headers: true });

csvs.on("data", function (line) {
  process.stdout.write(CSV.stringify(line));
});
fs.createReadStream("./twitter.csv").pipe(csvs);
