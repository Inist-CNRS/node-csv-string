var CSV = require(__dirname + '/..')

var acsv = require("a-csv");
var options = {
    delimiter: ","
};

acsv.parse('./twitter.csv', options, function (err, row, next) {
    if (row !== null) {
        process.stdout.write(CSV.stringify(row));
        next();
    }
});
