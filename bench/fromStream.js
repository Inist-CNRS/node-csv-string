var CSV = require(__dirname + '/..')

var stream = CSV.createStream();

stream.on('data', function (rows) {
    rows.forEach(function (item) {
        process.stdout.write(CSV.stringify(item));
      }
    );
  }
)

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.pipe(stream);

