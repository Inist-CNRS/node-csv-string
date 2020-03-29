import * as CSV from "../";
let buffer = "";

process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdin.on("data", function (chunk) {
  buffer += chunk.toString();
});
process.stdin.on("end", function () {
  CSV.readAll(buffer, ",", function (rows) {
    rows.forEach(function (item) {
      process.stdout.write(CSV.stringify(item));
    });
  });
});
