const { createReadStream } = require("fs");

const csv = require("csv-stream");

const CSV = require("..");

const FILE = `${__dirname}/twitter.csv`;

const csvStream = csv.createStream();

createReadStream(FILE)
  .pipe(csvStream)
  .on("data", (data) => {
    process.stdout.write(CSV.stringify(data));
  });
