var CSV = require(__dirname + '/..')

process.stdin.resume();
process.stdin.setEncoding('utf8');
var buffer = '';
process.stdin.on('data', function (chunk) {
    buffer += chunk.toString();
    var r;

    r = CSV.readAll(buffer, ',', function (rows) {
        rows.forEach(function(item) {
            process.stdout.write(CSV.stringify(item));
          }
        )
      }
    )
    if (r < buffer.length) {
      buffer = buffer.slice(r);
    }
    else {
      buffer = '';
    }
    
  }
);
