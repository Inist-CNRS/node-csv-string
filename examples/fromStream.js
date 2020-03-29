import * as CSV from "../";

const stream = CSV.createStream();

stream.on("data", function (rows) {
  process.stdout.write(CSV.stringify(rows, ","));
});

process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdin.pipe(stream);
