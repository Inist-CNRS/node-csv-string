const CSV = require(__dirname + "/..");

const nodecsv = require("csv");

nodecsv()
  .from.path(__dirname + "/twitter.csv")
  .on("record", function (row) {
    process.stdout.write(CSV.stringify(row));
  });
