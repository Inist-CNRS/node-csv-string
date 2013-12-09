'use strict';
var should = require('should')
, CSV = require('../lib/csv.js');

describe('CSV', function () {
    /* */
    describe('#1 stringify()', function () {
        it('should', function() {
            var str = CSV.stringify([0,1,2,3]);
            str.should.equal('0,1,2,3\r\n');
          }
        );
      }
    );
    describe('#2 stringify()', function () {
        it('should', function() {
            var str = CSV.stringify(['1','2','3']);
            str.should.equal('1,2,3\r\n');
          }
        );
      }
    );
    describe('#3 stringify()', function () {
        it('should', function() {
            var str = CSV.stringify(['"1"','2','3']);
            str.should.equal('"""1""",2,3\r\n');
          }
        );
      }
    );
    describe('#4 stringify()', function () {
        it('should', function() {
            var str = CSV.stringify(['1','2','3,4']);
            str.should.equal('1,2,"3,4"\r\n');
          }
        );
      }
    );
    describe('#5 stringify()', function () {
        it('should', function() {
            var str = CSV.stringify();
            str.should.equal('\r\n');;
          }
        );
      }
    );
    describe('#6 stringify()', function () {
        it('should', function() {
            var str = CSV.stringify('1234');
            str.should.equal('1234\r\n');
          }
        );
      }
    );
    describe('#7 stringify()', function () {
        it('should', function() {
            var str = CSV.stringify(1234);
            str.should.equal('1234\r\n');
          }
        );
      }
    );
    describe('#8 stringify()', function () {
        it('should', function() {
            var str = CSV.stringify("12,34");
            str.should.equal('"12,34"\r\n');
          }
        );
      }
    );
    describe('#9 stringify()', function () {
        it('should', function() {
            var str = CSV.stringify({a:1,b:2,c:3,d:4});
            str.should.equal('1,2,3,4\r\n');
          }
        );
      }
    );
    describe('#10 stringify()', function () {
        it('should', function() {
            var str = CSV.stringify(['a','b\nb', 'c']);
            str.should.equal('a,"b\nb",c\r\n');
          }
        );
      }
    );
    describe('#11 stringify()', function () {
        it('should', function() {
            var str = CSV.stringify({a:1,b:null});
            str.should.equal('1,\r\n');;
          }
        );
      }
    );
    describe('#12 stringify()', function () {
        it('should', function() {
            var str = CSV.stringify([[1,2], [3,4], [5,6]]);
            str.should.equal('1,2\r\n3,4\r\n5,6\r\n');
          }
        );
      }
    );
    describe('#13 stringify()', function() {
        it('should', function() {
            var header = [ 'one', 'two', 'three' ];
            var line1 =  [ '' , 'l-two', 'l-three' ];
            var headerCols = CSV.stringify(header).split(',').length;
            var line1Cols = CSV.stringify(line1).split(',').length;
            headerCols.should.equal(line1Cols);
          }
        );
      }
    );
    describe('#1 fetch()', function () {
        it('should', function() {
            var obj = CSV.fetch("a,b,c");
            obj.should.eql(['a', 'b', 'c']);
          }
        );
      }
    );
    describe('#1a fetch()', function () {
        it('should', function() {
            var obj = CSV.fetch('a ,\tb , c\n');
            obj.should.eql(['a ', '\tb ', ' c']);
          }
        );
      }
    );
    describe('#1b fetch()', function () {
        it('should', function() {
            var obj = CSV.fetch('"a ","\tb "," c\n"');
            obj.should.eql(['a ', '\tb ', ' c\n']);
          }
        );
      }
    );
    describe('#1c fetch()', function () {
        it('should', function() {
            var obj = CSV.fetch('"a" , "b"\t, "c" \n');
            obj.should.eql(['a', 'b', 'c']);
          }
        );
      }
    );
    describe('#2 fetch()', function () {
        it('should', function() {
            var obj = CSV.fetch("a,b,c\nd,e");
            obj.should.eql(['a', 'b', 'c']);
          }
        );
      }
    );
    describe('#3 fetch()', function () {
        it('should', function() {
            var obj = CSV.fetch('a,b,"c\nd",e');
            obj.should.eql(['a', 'b', 'c\nd', 'e']);
          }
        );
      }
    );
    describe('#4 fetch()', function () {
        it('should', function() {
            var obj = CSV.fetch('a,b,"c\n');
            obj.should.eql(['a', 'b']);
          }
        );
      }
    );
    describe('#5 fetch()', function () {
        it('should', function() {
            var obj = CSV.fetch('"a,a","b,b","c"');
            obj.should.eql(['a,a', 'b,b', 'c']);
          }
        );
      }
    );
    describe('#5b fetch()', function () {
        it('should', function() {
            var obj = CSV.fetch('"a,a" ,  "b,b","c"');
            obj.should.eql(['a,a', 'b,b', 'c']);
          }
        );
      }
    );
    describe('#5c fetch()', function() {
        it('should', function() {
            var obj = CSV.fetch('"a,a",,"c"');
            obj.should.eql(['a,a', '', 'c']);
          }
        );
      }
    );
    describe('#6 fetch()', function () {
        it('should', function() {
            var obj = CSV.fetch("a'a;b;;c\nd,e,f,g", ';');
            obj.should.eql(["a'a", 'b', '', 'c']);
          }
        );
      }
    );
    describe('#7 fetch()', function () {
        it('should', function() {
            var obj = CSV.fetch('a,b,c\r\n"d","e","f"');
            obj.should.eql(['a', 'b', 'c']);
          }
        );
      }
    );
    describe('#8 fetch()', function () {
        it('should', function() {
            var obj = CSV.fetch('a,"b,b""b,b""b",c\r\nd,e,f');
            obj.should.eql(['a', 'b,b"b,b"b', 'c']);
          }
        );
      }
    );
    describe('#9 fetch()', function () {
        it('should', function () {
            var obj = CSV.fetch('a,"b1,""b2""b3,b4""""",c\r\nd,e,f');
            obj.should.eql(['a', 'b1,"b2"b3,b4""', 'c']);
          }
        );
      }
    );
    describe('#10 fetch()', function () {
        it('should', function () {
            var obj = CSV.fetch("a,\"b1,\"\"b2\"\"b3,b4\"\"\"\"b5\r\nb6\"\r\nc,d");
            obj.should.eql(['a', "b1,\"b2\"b3,b4\"\"b5\r\nb6"]);
          }
        );
      }
    );
    describe('#10bis fetch()', function () {
        it('should', function () {
            var obj = CSV.fetch("a,\"b1,\"\"b2\"\"b3,b4\"\"\"\"b5\nb6\" \t\r\nc,d");
            obj.should.eql(['a', "b1,\"b2\"b3,b4\"\"b5\nb6"]);
          }
        );
      }
    );
    describe('#10ter fetch()', function () {
        it('should', function () {
            var obj = CSV.fetch("a,\"b1,\"\"b2\"\"b3,b4\"\"\"\"b5\nb6\" ,c\r\n,d");
            obj.should.eql(['a', "b1,\"b2\"b3,b4\"\"b5\nb6", 'c']);
          }
        );
      }
    );
    describe('#11 fetch()', function () {
        it('should', function () {
            var obj = CSV.fetch("a,\",b\",c\r\n,d");
            obj.should.eql(['a', ',b', 'c']);
          }
        );
      }
    );
    describe('#12 fetch()', function () {
        it('should', function () {
            var obj = CSV.fetch('a,"b",c\r\na,"b""b",c');
            obj.should.eql(['a', 'b', 'c']);
          }
        );
      }
    );
    describe('#1 forEach()', function () {
        it('should', function() {
            var i = 0;
            CSV.forEach('a,b,c\nd,e,f\ng,h,i', function(row, index) {
                index.should.equal(i++);
                if (index == 0) {
                  row.should.eql(['a','b','c']);
                }
                else if (index == 1) {
                  row.should.eql(['d','e','f']);
                }
                else if (index == 2) {
                  row.should.eql(['g','h','i']);
                }
            });
          }
        );
      }
    );
    describe('#2 forEach()', function () {
        it('should', function() {
            var i = 0;
            CSV.forEach('a,b,c\nd,e,f\ng,h,i', ',', function(row, index) {
                index.should.equal(i++);
                if (index == 0) {
                  row.should.eql(['a','b','c']);
                }
                else if (index == 1) {
                  row.should.eql(['d','e','f']);
                }
                else if (index == 2) {
                  row.should.eql(['g','h','i']);
                }
            });
          }
        );
      }
    );
     describe('#3 forEach()', function () {
        it('should', function() {
            var i = 0;
            CSV.forEach('a,b,c\nd,e,f\ng,h', ',', function(row, index) {
                index.should.equal(i++);
                if (index == 0) {
                  row.should.eql(['a','b','c']);
                }
                else if (index == 1) {
                  row.should.eql(['d','e','f']);
                }
                else if (index == 2) {
                  row.should.eql(['g','h']);
                }
            });
          }
        );
      }
    );

    describe('#1 parse()', function () {
        it('should', function() {
            var obj = CSV.parse('a,b,c\nd,e,f\ng,h,i');
            obj[0].should.eql(['a','b','c']);
            obj[1].should.eql(['d','e','f']);
            obj[2].should.eql(['g','h','i']);
          }
        );
      }
    );

    describe('#2 parse()', function () {
      it('should handle escaped quotes in a cell', function () {
        var data = 'a,b,c,1,"hello ""world""",12,14'
        var cols = CSV.parse(data)[0]
        cols.length.should.equal(7)
        var expected = ['a','b','c','1','hello "world"', '12', '14']
        JSON.stringify(cols).should.equal(JSON.stringify(expected))
      })
    });

    describe('#3 parse()', function () {
      it('should handle escaped quotes in a cell', function () {
        var data = 'a,b,c,1,"hello, ""world""",12,14'
        var cols = CSV.parse(data)[0]
        cols.length.should.equal(7)
        var expected = ['a','b','c','1','hello, "world"', '12', '14']
        JSON.stringify(cols).should.equal(JSON.stringify(expected))
      })
    });

    describe('#4 parse()', function () {
        it('should detect the separator if not provided as a parameter', function() {
            var obj = CSV.parse('a;b;c\nd;e;f\ng;h;i');
            obj[0].should.eql(['a','b','c']);
            obj[1].should.eql(['d','e','f']);
          }
        );
      }
    );

    describe('#1 detect()', function () {
        it('should', function() {
            CSV.detect('a,b,c\nd,e,f\ng,h,i').should.equal(',');
            CSV.detect('a;b;c\nd;e;f\ng;h;i').should.equal(';');
            CSV.detect('a|b|c\nd|e|f\ng|h|i').should.equal('|');
            CSV.detect('a\tb\tc\nd\te\tf\ng\th\ti').should.equal('\t');
          }
        );
      }
    );

    describe('#0 readAll()', function () {
        it('should', function() {

            CSV.readAll("A,B,C\nD,E,F", function(rows) {
                rows.should.includeEql(['A', 'B', 'C'])
                rows.should.includeEql(['D', 'E', 'F'])
            });
          }
        );
      }
    );

    describe('#1 readAll()', function () {
        it('should', function() {

            CSV.readAll("A,B,C\nD,E,F\n", function(rows) {
                rows.should.includeEql(['A', 'B', 'C'])
                rows.should.includeEql(['D', 'E', 'F'])
            });
          }
        );
      }
    );

    describe('#2 readAll()', function () {
        it('should', function() {
            CSV.readAll("A,B,C\nD,E,\"F\n", function(rows) {
                rows.should.includeEql(['A', 'B', 'C'])
                rows.should.not.includeEql(['D', 'E', 'F'])
            });
          }
        );
      }
    );

    describe('#3 readAll()', function () {
        it('should', function() {
            CSV.readAll("A,B,C\nD,E", function(rows) {
                rows.should.includeEql(['A', 'B', 'C'])
                rows.should.includeEql(['D', 'E'])
            });
          }
        );
      }
    );

    describe('#1 readChunk()', function () {
        it('should', function() {

            CSV.readChunk("A,B,C\nD,E,F", function(rows) {
                rows.should.includeEql(['A', 'B', 'C'])
                rows.should.not.includeEql(['D', 'E', 'F'])
            });
          }
        );
      }
    );

    describe('#2 readChunk()', function () {
        it('should', function() {
            CSV.readChunk("A,B,C\nD,E,\"F\n", function(rows) {
                rows.should.includeEql(['A', 'B', 'C'])
                rows.should.not.includeEql(['D', 'E', 'F'])
            });
          }
        );
      }
    );

    describe('#3 readChunk()', function () {
        it('should', function() {
            CSV.readChunk("A,B,C\nD,E", function(rows) {
                rows.should.includeEql(['A', 'B', 'C'])
                rows.should.not.includeEql(['D', 'E'])
            });
          }
        );
      }
    );



    /* */
  }
);
