/* global describe, it */
"use strict";
var should = require('should');
var path = require('path');
var fs = require('fs');
var CSV = require('../lib/csv.js');

describe('CSV', function () {
    describe('stringify()', function () {
        it('should #1', function() {
            var str = CSV.stringify([0, 1, 2, 3]);
            str.should.equal('0,1,2,3\r\n');
        });
        it('should #2', function() {
            var str = CSV.stringify(['1', '2', '3']);
            str.should.equal('1,2,3\r\n');
        });
        it('should #3', function() {
            var str = CSV.stringify(['"1"', '2', '3']);
            str.should.equal('"""1""",2,3\r\n');
        });
        it('should #4', function() {
            var str = CSV.stringify(['1', '2', '3,4']);
            str.should.equal('1,2,"3,4"\r\n');
        });
        it('should #5', function() {
            var str = CSV.stringify();
            str.should.equal('\r\n');
        });
        it('should #6', function() {
            var str = CSV.stringify('1234');
            str.should.equal('1234\r\n');
        });
        it('should #7', function() {
            var str = CSV.stringify(1234);
            str.should.equal('1234\r\n');
        });
        it('should #8', function() {
            var str = CSV.stringify("12,34");
            str.should.equal('"12,34"\r\n');
        });
        it('should #9', function() {
            var str = CSV.stringify({
                a: 1
                , b: 2
                , c: 3
                , d: 4
            });
            str.should.equal('1,2,3,4\r\n');
        });
        it('should #10', function() {
            var str = CSV.stringify(['a', 'b\nb', 'c']);
            str.should.equal('a,"b\nb",c\r\n');
        });
        it('should #11', function() {
            var str = CSV.stringify({
                a: 1
                , b: null
            });
            str.should.equal('1,\r\n');
        });
        it('should #12', function() {
            var str = CSV.stringify([[1, 2], [3, 4], [5, 6]]);
            str.should.equal('1,2\r\n3,4\r\n5,6\r\n');
        });
        it('should #13', function() {
            var header = ['one', 'two', 'three'];
            var line1 =  ['', 'l-two', 'l-three'];
            var headerCols = CSV.stringify(header).split(',').length;
            var line1Cols = CSV.stringify(line1).split(',').length;
            headerCols.should.equal(line1Cols);
        });
        it('should #14', function() {
            var str = CSV.stringify({
                a: null
                , b: ''
                , c: 1
            });
            str.should.equal(',,1\r\n');
        });
    });

    describe('fetch()', function () {
        it('should #1', function() {
            var obj = CSV.fetch("a,b,c");
            obj.should.eql(['a', 'b', 'c']);
        });
        it('should #2', function() {
            var obj = CSV.fetch('a ,\tb , c\n');
            obj.should.eql(['a ', '\tb ', ' c']);
        });
        it('should #3', function() {
            var obj = CSV.fetch('"a ","\tb "," c\n"');
            obj.should.eql(['a ', '\tb ', ' c\n']);
        });
        it('should #3', function() {
            var obj = CSV.fetch('"a" , "b"\t, "c" \n');
            obj.should.eql(['a', 'b', 'c']);
        });
        it('should #4', function() {
            var obj = CSV.fetch("a,b,c\nd,e");
            obj.should.eql(['a', 'b', 'c']);
        });
        it('should', function() {
            var obj = CSV.fetch('a,b,"c\nd",e');
            obj.should.eql(['a', 'b', 'c\nd', 'e']);
        });
        it('should #5', function() {
            var obj = CSV.fetch('a,b,"c\n');
            obj.should.eql(['a', 'b']);
        });
        it('should #6', function() {
            var obj = CSV.fetch('"a,a","b,b","c"');
            obj.should.eql(['a,a', 'b,b', 'c']);
        });
        it('should #7', function() {
            var obj = CSV.fetch('"a,a" ,  "b,b","c"');
            obj.should.eql(['a,a', 'b,b', 'c']);
        });
        it('should #8', function() {
            var obj = CSV.fetch('"a,a",,"c"');
            obj.should.eql(['a,a', '', 'c']);
        });
        it('should #9', function() {
            var obj = CSV.fetch("a'a;b;;c\nd,e,f,g", ';');
            obj.should.eql(["a'a", 'b', '', 'c']);
        });
        it('should #10', function() {
            var obj = CSV.fetch('a,b,c\r\n"d","e","f"');
            obj.should.eql(['a', 'b', 'c']);
        });
        it('should #11', function() {
            var obj = CSV.fetch('a,"b,b""b,b""b",c\r\nd,e,f');
            obj.should.eql(['a', 'b,b"b,b"b', 'c']);
        });
        it('should #12', function () {
            var obj = CSV.fetch('a,"b1,""b2""b3,b4""""",c\r\nd,e,f');
            obj.should.eql(['a', 'b1,"b2"b3,b4""', 'c']);
        });
        it('should #13', function () {
            var obj = CSV.fetch("a,\"b1,\"\"b2\"\"b3,b4\"\"\"\"b5\r\nb6\"\r\nc,d");
            obj.should.eql(['a', "b1,\"b2\"b3,b4\"\"b5\r\nb6"]);
        });
        it('should #14', function () {
            var obj = CSV.fetch("a,\"b1,\"\"b2\"\"b3,b4\"\"\"\"b5\nb6\" \t\r\nc,d");
            obj.should.eql(['a', "b1,\"b2\"b3,b4\"\"b5\nb6"]);
        });
        it('should #15', function () {
            var obj = CSV.fetch("a,\"b1,\"\"b2\"\"b3,b4\"\"\"\"b5\nb6\" ,c\r\n,d");
            obj.should.eql(['a', "b1,\"b2\"b3,b4\"\"b5\nb6", 'c']);
        });
        it('should #15', function () {
            var obj = CSV.fetch("a,\",b\",c\r\n,d");
            obj.should.eql(['a', ',b', 'c']);
        });
        it('should #16', function () {
            var obj = CSV.fetch('a,"b",c\r\na,"b""b",c');
            obj.should.eql(['a', 'b', 'c']);
        });
        it('should #17', function () {
            var obj = CSV.fetch('a,this "should" work,b');
            obj.should.eql(['a', 'this "should" work', 'b']);
        });
    });

    describe('forEach()', function () {
        it('should #1', function() {
            var i = 0;
            CSV.forEach('a,b,c\nd,e,f\ng,h,i', function(row, index) {
                index.should.equal(i++);
                if (index === 0) {
                    row.should.eql(['a', 'b', 'c']);
                }
                else if (index == 1) {
                    row.should.eql(['d', 'e', 'f']);
                }
                else if (index == 2) {
                    row.should.eql(['g', 'h', 'i']);
                }
            });
        });
        it('should #2', function() {
            var i = 0;
            CSV.forEach('a,b,c\nd,e,f\ng,h,i', ',', function(row, index) {
                index.should.equal(i++);
                if (index == 0) {
                    row.should.eql(['a', 'b', 'c']);
                }
                else if (index == 1) {
                    row.should.eql(['d', 'e', 'f']);
                }
                else if (index == 2) {
                    row.should.eql(['g', 'h', 'i']);
                }
            });
        });
        it('should #3', function() {
            var i = 0;
            CSV.forEach('a,b,c\nd,e,f\ng,h', ',', function(row, index) {
                index.should.equal(i++);
                if (index == 0) {
                    row.should.eql(['a', 'b', 'c']);
                }
                else if (index == 1) {
                    row.should.eql(['d', 'e', 'f']);
                }
                else if (index == 2) {
                    row.should.eql(['g', 'h']);
                }
            });
        });
    });

    describe('parse()', function () {
        it('should #1', function() {
            var obj = CSV.parse('a,b,c\nd,e,f\ng,h,i');
            obj[0].should.eql(['a', 'b', 'c']);
            obj[1].should.eql(['d', 'e', 'f']);
            obj[2].should.eql(['g', 'h', 'i']);
        });
        it('should #2', function () {
            var data = 'a,b,c,1,"hello ""world""",12,14'
            var cols = CSV.parse(data)[0]
            cols.length.should.equal(7)
            var expected = ['a', 'b', 'c', '1', 'hello "world"', '12', '14']
            JSON.stringify(cols).should.equal(JSON.stringify(expected))
        })
        it('should #3', function () {
            var data = 'a,b,c,1,"hello, ""world""",12,14'
            var cols = CSV.parse(data)[0]
            cols.length.should.equal(7)
            var expected = ['a', 'b', 'c', '1', 'hello, "world"', '12', '14']
            JSON.stringify(cols).should.equal(JSON.stringify(expected))
        });
        it('should #4', function() {
            var obj = CSV.parse('a;b;c\nd;e;f\ng;h;i');
            obj[0].should.eql(['a', 'b', 'c']);
            obj[1].should.eql(['d', 'e', 'f']);
        });
    });

    describe('detect()', function () {
        it('should #1', function() {
            CSV.detect('a,b,c\nd,e,f\ng,h,i').should.equal(',');
            CSV.detect('a;b;c\nd;e;f\ng;h;i').should.equal(';');
            CSV.detect('a|b|c\nd|e|f\ng|h|i').should.equal('|');
            CSV.detect('a\tb\tc\nd\te\tf\ng\th\ti').should.equal('\t');
        });
    });

    describe('readAll()', function () {
        it('should #0', function() {
            CSV.readAll("A,B,C\nD,E,F", function(rows) {
                rows.should.includeEql(['A', 'B', 'C'])
                rows.should.includeEql(['D', 'E', 'F'])
            });
        });
        it('should #1', function() {
            CSV.readAll("A,B,C\nD,E,F\n", function(rows) {
                rows.should.includeEql(['A', 'B', 'C'])
                rows.should.includeEql(['D', 'E', 'F'])
            });
        });
        it('should #2', function() {
            CSV.readAll("A,B,C\nD,E,\"F\n", function(rows) {
                rows.should.includeEql(['A', 'B', 'C'])
                rows.should.not.includeEql(['D', 'E', 'F'])
            });
        });
        it('should #3', function() {
            CSV.readAll("A,B,C\nD,E", function(rows) {
                rows.should.includeEql(['A', 'B', 'C'])
                rows.should.includeEql(['D', 'E'])
            });
        });
    });

    describe('readChunk()', function () {
        it('should #1', function() {
            CSV.readChunk("A,B,C\nD,E,F", function(rows) {
                rows.should.includeEql(['A', 'B', 'C'])
                rows.should.not.includeEql(['D', 'E', 'F'])
            });
        });
        it('should #2', function() {
            CSV.readChunk("A,B,C\nD,E,\"F\n", function(rows) {
                rows.should.includeEql(['A', 'B', 'C'])
                rows.should.not.includeEql(['D', 'E', 'F'])
            });
        });
        it('should #3', function() {
            CSV.readChunk("A,B,C\nD,E", function(rows) {
                rows.should.includeEql(['A', 'B', 'C'])
                rows.should.not.includeEql(['D', 'E'])
            });
        });
    });

    describe('readStream()', function () {
        it('should #1', function() {
            var reader = fs.createReadStream(path.resolve(__dirname, './sample.csv'));
            var parser = CSV.createStream({ separator: ',' });
            var rows = [];
            parser.on('data', function(row) {
                rows.push(row);
            });
            parser.on('end', function() {
                should.deepEqual(rows, CSV.parse('1,2,"3,3",4\n1,2,3,4'))
            });
            reader.pipe(parser);
        });
        it('should #2', function() {
            var reader = fs.createReadStream(path.resolve(__dirname, './sample.csv'), {highWaterMark: 5});
            var parser = CSV.createStream({ separator: ',' });
            var rows = [];
            parser.on('data', function(row) {
                rows.push(row);
            });
            parser.on('end', function() {
                should.deepEqual(rows, CSV.parse('1,2,"3,3",4\n1,2,3,4'))
            });
            reader.pipe(parser);
        });
    });
});
