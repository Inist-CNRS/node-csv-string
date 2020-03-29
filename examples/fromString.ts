import * as CSV from "..";

let buffer = "";

process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk.toString();
});
process.stdin.on("end", () => {
  CSV.readAll(buffer, ",", (rows) => {
    rows.forEach((item) => {
      process.stdout.write(CSV.stringify(item));
    });
  });
});
