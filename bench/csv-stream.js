var CSV = require(__dirname + '/..')

var csv_stream = require('csv-stream');
var fs = require('fs');


var csvStream = csv_stream.createStream();

fs.createReadStream('./twitter.csv').pipe(csvStream).
    on('data', function(data) {
        process.stdout.write(CSV.stringify(data));
    }
    )

