var CSV = require(__dirname + '/..')

process.stdin.resume();
process.stdin.setEncoding('utf8');
var buffer = '';
process.stdin.on('data', function (chunk) {
    //console.log('uuu', buffer.slice(-10), '|', chunk.toString().slice(0, 10))
    buffer = buffer.concat('456}', chunk.toString());
    //console.log('vvv', buffer.slice(0, 30));
    var r;

    r = CSV.readAll(buffer, ',', function (rows) {
        rows.forEach(function(item) {
            process.stdout.write(CSV.stringify(item));
          }
        )
      }
    )
    if (r < buffer.length) {
      buffer = '{123' + buffer.slice(r) ;
    }
    else {
      buffer = '';
    }
    
  }
);
