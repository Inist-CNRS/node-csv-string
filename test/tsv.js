var CSV = require("../lib/csv");
var fs = require("fs");
var path = require("path");
var should = require("should");

describe("TSV", function() {
    describe("fetch()", function() {
        it("should #1", function() {
            var obj = CSV.fetch("a\tb\tc", "\t");
            obj.should.eql(["a", "b", "c"]);
        });
        it("should #1a", function() {
            var obj = CSV.fetch("a \t,b \t c\n", "\t");
            obj.should.eql(["a ", ",b ", " c"]);
        });
        it("should #1b", function() {
            var obj = CSV.fetch('"a "\t"\tb "\t" c\n"', "\t");
            obj.should.eql(["a ", "\tb ", " c\n"]);
        });
        it("should #1c", function() {
            var obj = CSV.fetch('"a" \t "b" \t "c" \n', "\t");
            obj.should.eql(["a", "b", "c"]);
        });
        it("should #2", function() {
            var obj = CSV.fetch("a\tb\tc\nd\te", "\t");
            obj.should.eql(["a", "b", "c"]);
        });
        it("should #3", function() {
            var obj = CSV.fetch('a\tb\t"c\nd"\te', "\t");
            obj.should.eql(["a", "b", "c\nd", "e"]);
        });
        it("should #4", function() {
            var obj = CSV.fetch('a\tb\t"c\n', "\t");
            obj.should.eql(["a", "b"]);
        });
        it("should #5", function() {
            var obj = CSV.fetch('"a\ta"\t"b\tb"\t"c"', "\t");
            obj.should.eql(["a\ta", "b\tb", "c"]);
        });
        it("should #5b", function() {
            var obj = CSV.fetch('"a\ta" \t  "b\tb"\t"c"', "\t");
            obj.should.eql(["a\ta", "b\tb", "c"]);
        });
        it("should #5c", function() {
            var obj = CSV.fetch('"a\ta"\t\t"c"', "\t");
            obj.should.eql(["a\ta", "", "c"]);
        });
        it("should #6", function() {
            var obj = CSV.fetch("a'a;b;;c\nd\te\tf\tg", ";");
            obj.should.eql(["a'a", "b", "", "c"]);
        });
        it("should #7", function() {
            var obj = CSV.fetch('a\tb\tc\r\n"d"\t"e"\t"f"', "\t");
            obj.should.eql(["a", "b", "c"]);
        });
        it("should #8", function() {
            var obj = CSV.fetch('a\t"b\tb""b\tb""b"\tc\r\nd\te\tf', "\t");
            obj.should.eql(["a", 'b\tb"b\tb"b', "c"]);
        });
        it("should #9", function() {
            var obj = CSV.fetch('a\t"b1\t""b2""b3\tb4"""""\tc\r\nd\te\tf', "\t");
            obj.should.eql(["a", 'b1\t"b2"b3\tb4""', "c"]);
        });
        it("should #10", function() {
            var obj = CSV.fetch('a\t"b1\t""b2""b3\tb4""""b5\r\nb6"\r\nc\td', "\t");
            obj.should.eql(["a", 'b1\t"b2"b3\tb4""b5\r\nb6']);
        });
        it("should #10bis", function() {
            var obj = CSV.fetch('a\t"b1\t""b2""b3\tb4""""b5\nb6"  \r\nc\td', "\t");
            obj.should.eql(["a", 'b1\t"b2"b3\tb4""b5\nb6']);
        });
        it("should #10ter", function() {
            var obj = CSV.fetch('a\t"b1\t""b2""b3\tb4""""b5\nb6" \tc\r\n\td', "\t");
            obj.should.eql(["a", 'b1\t"b2"b3\tb4""b5\nb6', "c"]);
        });
        it("should #11", function() {
            var obj = CSV.fetch('a\t"\tb"\tc\r\n\td', "\t");
            obj.should.eql(["a", "\tb", "c"]);
        });
        it("should #12", function() {
            var obj = CSV.fetch('a\t"b"\tc\r\na\t"b""b"\tc', "\t");
            obj.should.eql(["a", "b", "c"]);
        });
        it("should get simple fields containing double quotes #13", function() {
            var obj = CSV.fetch('a\tthis "should" work\tb', "\t");
            obj.should.eql(["a", 'this "should" work', "b"]);
        });
        it("should get simple fields containing doubled simple quotes #14", function() {
            var obj = CSV.fetch("a\tb''b\tc", "\t");
            obj.should.eql(["a", "b''b", "c"]);
        });
    });
    describe("fetch() with alternative quote and separator", function() {
        it("should #1", function() {
            var obj = CSV.fetch("a|b|c", "|", "#");
            obj.should.eql(["a", "b", "c"]);
        });
        it("should #1a", function() {
            var obj = CSV.fetch("a |,b | c\n", "|", "#");
            obj.should.eql(["a ", ",b ", " c"]);
        });
        it("should #1b", function() {
            var obj = CSV.fetch("#a #|#|b #|# c\n#", "|", "#");
            obj.should.eql(["a ", "|b ", " c\n"]);
        });
        it("should #1c", function() {
            var obj = CSV.fetch("#a# | #b# | #c# \n", "|", "#");
            obj.should.eql(["a", "b", "c"]);
        });
        it("should #2", function() {
            var obj = CSV.fetch("a|b|c\nd|e", "|", "#");
            obj.should.eql(["a", "b", "c"]);
        });
        it("should #3", function() {
            var obj = CSV.fetch("a|b|#c\nd#|e", "|", "#");
            obj.should.eql(["a", "b", "c\nd", "e"]);
        });
        it("should #4", function() {
            var obj = CSV.fetch("a|b|#c\n", "|", "#");
            obj.should.eql(["a", "b"]);
        });
        it("should #5", function() {
            var obj = CSV.fetch("#a|a#|#b|b#|#c#", "|", "#");
            obj.should.eql(["a|a", "b|b", "c"]);
        });
        it("should #5b", function() {
            var obj = CSV.fetch("#a|a# |  #b|b#|#c#", "|", "#");
            obj.should.eql(["a|a", "b|b", "c"]);
        });
        it("should #5c", function() {
            var obj = CSV.fetch("#a|a#||#c#", "|", "#");
            obj.should.eql(["a|a", "", "c"]);
        });
        it("should #6", function() {
            var obj = CSV.fetch("a'a;b;;c\nd|e|f|g", ";");
            obj.should.eql(["a'a", "b", "", "c"]);
        });
        it("should #7", function() {
            var obj = CSV.fetch("a|b|c\r\n#d#|#e#|#f#", "|", "#");
            obj.should.eql(["a", "b", "c"]);
        });
        it("should #8", function() {
            var obj = CSV.fetch("a|#b|b##b|b##b#|c\r\nd|e|f", "|", "#");
            obj.should.eql(["a", "b|b#b|b#b", "c"]);
        });
        it("should #9", function() {
            var obj = CSV.fetch("a|#b1|##b2##b3|b4#####|c\r\nd|e|f", "|", "#");
            obj.should.eql(["a", "b1|#b2#b3|b4##", "c"]);
        });
        it("should #12", function() {
            var obj = CSV.fetch("a|#b#|c\r\na|#b##b#|c", "|", "#");
            obj.should.eql(["a", "b", "c"]);
        });
        it("should get simple fields containing double quotes #13", function() {
            var obj = CSV.fetch("a|this #should# work|b", "|", "#");
            obj.should.eql(["a", "this #should# work", "b"]);
        });
        it("should get simple fields containing doubled simple quotes #14", function() {
            var obj = CSV.fetch("a|b''b|c", "|", "#");
            obj.should.eql(["a", "b''b", "c"]);
        });
    });

    describe("fetch() with separator and no quote", function() {
        it("should #1", function() {
            var obj = CSV.fetch("a\tb\tc", "\t", "\b");
            obj.should.eql(["a", "b", "c"]);
        });
        it("should #2", function() {
            var obj = CSV.fetch('a\t"b"\tc', "\t", "\b");
            obj.should.eql(["a", '"b"', "c"]);
        });
        it("should #3", function() {
            var obj = CSV.fetch('a\t"b"b\tc', "\t", "\b");
            obj.should.eql(["a", '"b"b', "c"]);
        });
    });

    describe("readStream()", function() {
        it("should #1", function() {
            var reader = fs.createReadStream(path.resolve(__dirname, "./sample.txt"));
            var parser = CSV.createStream({ separator: "|"
                , quote: "#" });
            var rows = [];
            parser.on("data", function(row) {
                rows.push(row);
            });
            parser.on("end", function() {
                should.deepEqual(rows, CSV.parse("1|2|#3|3#|4\n1|2|3|4", "|", "#"));
            });
            reader.pipe(parser);
        });
        it("should #2", function() {
            var reader = fs.createReadStream(
                path.resolve(__dirname, "./sample.txt"),
                { highWaterMark: 5 }
            );
            var parser = CSV.createStream({ separator: "|"
                , quote: "#" });
            var rows = [];
            parser.on("data", function(row) {
                rows.push(row);
            });
            parser.on("end", function() {
                should.deepEqual(rows, CSV.parse("1|2|#3|3#|4\n1|2|3|4", "|", "#"));
            });
            reader.pipe(parser);
        });
    });

    /* */
});
