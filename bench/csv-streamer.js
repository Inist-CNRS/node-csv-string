var CSV = require(__dirname + '/..')

var fs = require('fs');
var CSVStream = require('csv-streamer');
var csvs = new CSVStream({headers: true});

csvs.on('data', function(line) {
    process.stdout.write(CSV.stringify(line));
});
fs.createReadStream('./twitter.csv').pipe(csvs);
