var CSV = require(__dirname + '/..')

var stream = CSV.createStream();

stream.on('data', function (rows) {
    process.stdout.write(CSV.stringify(rows, ','));
  }
)

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.pipe(stream);

