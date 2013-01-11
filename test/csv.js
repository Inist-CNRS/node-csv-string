'use strict';
var should = require('should')
, CSV = require('../lib/csv.js');

describe('CSV', function () {
    describe('stringify()', function () {
        it('should', function() {
            var str = CSV.stringify([1,2,3]);
            str.should.equal('1,2,3\r\n');
          }
        );
      }
    );
    describe('stringify()', function () {
        it('should', function() {
            var str = CSV.stringify(['1','2','3']);
            str.should.equal('1,2,3\r\n');
          }
        );
      }
    );
    describe('stringify()', function () {
        it('should', function() {
            var str = CSV.stringify(['"1"','2','3']);
            str.should.equal('"""1""",2,3\r\n');
          }
        );
      }
    );
    describe('stringify()', function () {
        it('should', function() {
            var str = CSV.stringify(['1','2','3,4']);
            str.should.equal('1,2,"3,4"\r\n');
          }
        );
      }
    );
    describe('stringify()', function () {
        it('should', function() {
            var str = CSV.stringify();
            str.should.equal('\r\n');;
          }
        );
      }
    );
    describe('stringify()', function () {
        it('should', function() {
            var str = CSV.stringify('1234');
            str.should.equal('1234\r\n');
          }
        );
      }
    );
    describe('stringify()', function () {
        it('should', function() {
            var str = CSV.stringify(1234);
            str.should.equal('1234\r\n');
          }
        );
      }
    );
    describe('stringify()', function () {
        it('should', function() {
            var str = CSV.stringify("12,34");
            str.should.equal('"12,34"\r\n');
          }
        );
      }
    );
    describe('stringify()', function () {
        it('should', function() {
            var str = CSV.stringify({a:1,b:2,c:3,d:4});
            str.should.equal('1,2,3,4\r\n');
          }
        );
      }
    );
    describe('stringify()', function () {
        it('should', function() {
            var str = CSV.stringify(['a','b\nb', 'c']);
            str.should.equal('a,"b\nb",c\r\n');
          }
        );
      }
    );
    describe('stringify()', function () {
        it('should', function() {
            var str = CSV.stringify({a:1,b:null});
            str.should.equal('1,\r\n');;
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
    describe('#1 parse()', function () {
        it('should', function() {
            var obj = CSV.parse('a,b,c\nd,e,f\ng,h,i');
            obj[0].should.eql(['a','b','c']);
            obj[1].should.eql(['g','h','i']);
          }
        );
      }
    );

    /* */
  }
);
