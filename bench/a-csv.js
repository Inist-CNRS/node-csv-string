const acsv = require("a-csv");

const CSV = require("..");

const FILE = `${__dirname}/twitter.csv`;

const options = {
  delimiter: ",",
  headers: true,
};

acsv.parse(FILE, options, (err, row, next) => {
  if (row !== null) {
    process.stdout.write(CSV.stringify(row));
    next();
  }
});
