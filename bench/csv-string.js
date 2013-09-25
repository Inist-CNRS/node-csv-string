var CSV = require(__dirname + '/..')
var fs = require('fs');

var stream = CSV.createStream();

stream.on('data', function (row) {
    process.stdout.write(CSV.stringify(row));
  }
)

fs.createReadStream('./twitter.csv').pipe(stream)
