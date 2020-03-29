var CSV = require(__dirname + '/..')

var fs = require('fs');
var stream = fs.createReadStream("./twitter.csv");

var fastcsv = require("fast-csv");

fastcsv(stream, {headers: true}).
    on("data", function(data) {
        process.stdout.write(CSV.stringify(data));
    }
    ).
    parse();
