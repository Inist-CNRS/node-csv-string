const CSV = require(__dirname + "/..");
const fs = require("fs");

const stream = CSV.createStream();

stream.on("data", function (row) {
  process.stdout.write(CSV.stringify(row));
});

fs.createReadStream("./twitter.csv").pipe(stream);
