var CSV = require(__dirname + '/..');
var buffer = '';

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (chunk) {
    buffer += chunk.toString();
  }
);
process.stdin.on('end', function () {
    var r = CSV.readAll(buffer, ',', function (rows) {
        rows.forEach(function(item) {
            process.stdout.write(CSV.stringify(item));
          }
        )
      }
    )
  }
);



