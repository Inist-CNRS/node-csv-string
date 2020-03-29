const CSV = require(__dirname + "/..");

const acsv = require("a-csv");
const options = {
  delimiter: ",",
};

acsv.parse("./twitter.csv", options, function (err, row, next) {
  if (row !== null) {
    process.stdout.write(CSV.stringify(row));
    next();
  }
});
