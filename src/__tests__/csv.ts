import * as fs from "fs";
import * as path from "path";

import * as CSV from "../";

describe("CSV", () => {
  describe("stringify()", () => {
    it("should #1", () => {
      const str = CSV.stringify([0, 1, 2, 3]);
      expect(str).toEqual("0,1,2,3\r\n");
    });
    it("should #2", () => {
      const str = CSV.stringify(["1", "2", "3"]);
      expect(str).toEqual("1,2,3\r\n");
    });
    it("should #3", () => {
      const str = CSV.stringify(['"1"', "2", "3"]);
      expect(str).toEqual('"""1""",2,3\r\n');
    });
    it("should #4", () => {
      const str = CSV.stringify(["1", "2", "3,4"]);
      expect(str).toEqual('1,2,"3,4"\r\n');
    });
    it("should #5", () => {
      const str = CSV.stringify();
      expect(str).toEqual("\r\n");
    });
    it("should #5bis", () => {
      const str = CSV.stringify([]);
      expect(str).toEqual("\r\n");
    });
    it("should #6", () => {
      const str = CSV.stringify("1234");
      expect(str).toEqual("1234\r\n");
    });
    it("should #7", () => {
      const str = CSV.stringify(1234);
      expect(str).toEqual("1234\r\n");
    });
    it("should #8", () => {
      const str = CSV.stringify("12,34");
      expect(str).toEqual('"12,34"\r\n');
    });
    it("should #9", () => {
      const str = CSV.stringify({
        a: 1,
        b: 2,
        c: 3,
        d: 4,
      });
      expect(str).toEqual("1,2,3,4\r\n");
    });
    it("should #10", () => {
      const str = CSV.stringify(["a", "b\nb", "c"]);
      expect(str).toEqual('a,"b\nb",c\r\n');
    });
    it("should #11", () => {
      const str = CSV.stringify({
        a: 1,
        b: null,
      });
      expect(str).toEqual("1,\r\n");
    });
    it("should #12", () => {
      const str = CSV.stringify([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
      expect(str).toEqual("1,2\r\n3,4\r\n5,6\r\n");
    });
    it("should #13", () => {
      const header = ["one", "two", "three"];
      const line1 = ["", "l-two", "l-three"];
      const headerCols = CSV.stringify(header).split(",").length;
      const line1Cols = CSV.stringify(line1).split(",").length;
      expect(headerCols).toEqual(line1Cols);
    });
    it("should #14", () => {
      const str = CSV.stringify({
        a: null,
        b: "",
        c: 1,
      });
      expect(str).toEqual(",,1\r\n");
    });
  });

  describe("fetch()", () => {
    it("should #1", () => {
      const obj = CSV.fetch("a,b,c");
      expect(obj).toEqual(["a", "b", "c"]);
    });
    it("should #2", () => {
      const obj = CSV.fetch("a ,\tb , c\n");
      expect(obj).toEqual(["a ", "\tb ", " c"]);
    });
    it("should #3", () => {
      const obj = CSV.fetch('"a ","\tb "," c\n"');
      expect(obj).toEqual(["a ", "\tb ", " c\n"]);
    });
    it("should #3", () => {
      const obj = CSV.fetch('"a" , "b"\t, "c" \n');
      expect(obj).toEqual(["a", "b", "c"]);
    });
    it("should #4", () => {
      const obj = CSV.fetch("a,b,c\nd,e");
      expect(obj).toEqual(["a", "b", "c"]);
    });
    it("should", () => {
      const obj = CSV.fetch('a,b,"c\nd",e');
      expect(obj).toEqual(["a", "b", "c\nd", "e"]);
    });
    it("should #5", () => {
      const obj = CSV.fetch('a,b,"c\n');
      expect(obj).toEqual(["a", "b"]);
    });
    it("should #6", () => {
      const obj = CSV.fetch('"a,a","b,b","c"');
      expect(obj).toEqual(["a,a", "b,b", "c"]);
    });
    it("should #7", () => {
      const obj = CSV.fetch('"a,a" ,  "b,b","c"');
      expect(obj).toEqual(["a,a", "b,b", "c"]);
    });
    it("should #8", () => {
      const obj = CSV.fetch('"a,a",,"c"');
      expect(obj).toEqual(["a,a", "", "c"]);
    });
    it("should #9", () => {
      const obj = CSV.fetch("a'a;b;;c\nd,e,f,g", ";");
      expect(obj).toEqual(["a'a", "b", "", "c"]);
    });
    it("should #10", () => {
      const obj = CSV.fetch('a,b,c\r\n"d","e","f"');
      expect(obj).toEqual(["a", "b", "c"]);
    });
    it("should #11", () => {
      const obj = CSV.fetch('a,"b,b""b,b""b",c\r\nd,e,f');
      expect(obj).toEqual(["a", 'b,b"b,b"b', "c"]);
    });
    it("should #12", () => {
      const obj = CSV.fetch('a,"b1,""b2""b3,b4""""",c\r\nd,e,f');
      expect(obj).toEqual(["a", 'b1,"b2"b3,b4""', "c"]);
    });
    it("should #13", () => {
      const obj = CSV.fetch('a,"b1,""b2""b3,b4""""b5\r\nb6"\r\nc,d');
      expect(obj).toEqual(["a", 'b1,"b2"b3,b4""b5\r\nb6']);
    });
    it("should #14", () => {
      const obj = CSV.fetch('a,"b1,""b2""b3,b4""""b5\nb6" \t\r\nc,d');
      expect(obj).toEqual(["a", 'b1,"b2"b3,b4""b5\nb6']);
    });
    it("should #15", () => {
      const obj = CSV.fetch('a,"b1,""b2""b3,b4""""b5\nb6" ,c\r\n,d');
      expect(obj).toEqual(["a", 'b1,"b2"b3,b4""b5\nb6', "c"]);
    });
    it("should #15", () => {
      const obj = CSV.fetch('a,",b",c\r\n,d');
      expect(obj).toEqual(["a", ",b", "c"]);
    });
    it("should #16", () => {
      const obj = CSV.fetch('a,"b",c\r\na,"b""b",c');
      expect(obj).toEqual(["a", "b", "c"]);
    });
    it("should #17", () => {
      const obj = CSV.fetch('a,this "should" work,b');
      expect(obj).toEqual(["a", 'this "should" work', "b"]);
    });
  });

  describe("forEach()", () => {
    it("should #1", () => {
      let i = 0;
      CSV.forEach("a,b,c\nd,e,f\ng,h,i", (row, index) => {
        expect(index).toEqual(i++);
        if (index === 0) {
          expect(row).toEqual(["a", "b", "c"]);
        } else if (index == 1) {
          expect(row).toEqual(["d", "e", "f"]);
        } else if (index == 2) {
          expect(row).toEqual(["g", "h", "i"]);
        }
      });
    });
    it("should #2", () => {
      let i = 0;
      CSV.forEach("a,b,c\nd,e,f\ng,h,i", ",", (row, index) => {
        expect(index).toEqual(i++);
        if (index == 0) {
          expect(row).toEqual(["a", "b", "c"]);
        } else if (index == 1) {
          expect(row).toEqual(["d", "e", "f"]);
        } else if (index == 2) {
          expect(row).toEqual(["g", "h", "i"]);
        }
      });
    });
    it("should #3", () => {
      let i = 0;
      CSV.forEach("a,b,c\nd,e,f\ng,h", ",", (row, index) => {
        expect(index).toEqual(i++);
        if (index == 0) {
          expect(row).toEqual(["a", "b", "c"]);
        } else if (index == 1) {
          expect(row).toEqual(["d", "e", "f"]);
        } else if (index == 2) {
          expect(row).toEqual(["g", "h"]);
        }
      });
    });
  });

  describe("parse()", () => {
    it("should #1", () => {
      const obj = CSV.parse("a,b,c\nd,e,f\ng,h,i");
      expect(obj[0]).toEqual(["a", "b", "c"]);
      expect(obj[1]).toEqual(["d", "e", "f"]);
      expect(obj[2]).toEqual(["g", "h", "i"]);
    });
    it("should #2", () => {
      const data = 'a,b,c,1,"hello ""world""",12,14';
      const cols = CSV.parse(data)[0];
      expect(cols.length).toEqual(7);
      const expected = ["a", "b", "c", "1", 'hello "world"', "12", "14"];
      expect(JSON.stringify(cols)).toEqual(JSON.stringify(expected));
    });
    it("should #3", () => {
      const data = 'a,b,c,1,"hello, ""world""",12,14';
      const cols = CSV.parse(data)[0];
      expect(cols.length).toEqual(7);
      const expected = ["a", "b", "c", "1", 'hello, "world"', "12", "14"];
      expect(JSON.stringify(cols)).toEqual(JSON.stringify(expected));
    });
    it("should #4", () => {
      const obj = CSV.parse("a;b;c\nd;e;f\ng;h;i");
      expect(obj[0]).toEqual(["a", "b", "c"]);
      expect(obj[1]).toEqual(["d", "e", "f"]);
    });
    it("should #5", () => {
      const obj = CSV.parse("a,b,c\nd,e,f\ng,h,i", ",,,,,,");
      expect(obj[0]).toEqual(["a", "b", "c"]);
      expect(obj[1]).toEqual(["d", "e", "f"]);
      expect(obj[2]).toEqual(["g", "h", "i"]);
    });
    it("should #6", () => {
      const obj = CSV.parse("a,b,c\nd,e,f\ng,h,i", ",");
      expect(obj[0]).toEqual(["a", "b", "c"]);
      expect(obj[1]).toEqual(["d", "e", "f"]);
      expect(obj[2]).toEqual(["g", "h", "i"]);
    });
  });

  describe("parse+stringify", () => {
    it("should #1", () => {
      const testdata = [
        ["a\rb", "cd"],
        ["a\r,\rb", "cd"],
      ];
      expect(testdata).toEqual(CSV.parse(CSV.stringify(testdata)));
    });
  });

  describe("detect()", () => {
    it("should #1", () => {
      expect(CSV.detect("a,b,c\nd,e,f\ng,h,i")).toEqual(",");
      expect(CSV.detect("a;b;c\nd;e;f\ng;h;i")).toEqual(";");
      expect(CSV.detect("a|b|c\nd|e|f\ng|h|i")).toEqual("|");
      expect(CSV.detect("a\tb\tc\nd\te\tf\ng\th\ti")).toEqual("\t");
    });
  });

  describe("readAll()", () => {
    it("should #0", () => {
      CSV.readAll("A,B,C\nD,E,F", (rows) => {
        expect(rows).toContainEqual(["A", "B", "C"]);
        expect(rows).toContainEqual(["D", "E", "F"]);
      });
    });
    it("should #1", () => {
      CSV.readAll("A,B,C\nD,E,F\n", (rows) => {
        expect(rows).toContainEqual(["A", "B", "C"]);
        expect(rows).toContainEqual(["D", "E", "F"]);
      });
    });
    it("should #2", () => {
      CSV.readAll('A,B,C\nD,E,"F\n', (rows) => {
        expect(rows).toContainEqual(["A", "B", "C"]);
        expect(rows).not.toContainEqual(["D", "E", "F"]);
      });
    });
    it("should #3", () => {
      CSV.readAll("A,B,C\nD,E", (rows) => {
        expect(rows).toContainEqual(["A", "B", "C"]);
        expect(rows).toContainEqual(["D", "E"]);
      });
    });
  });

  describe("readChunk()", () => {
    it("should #1", () => {
      CSV.readChunk("A,B,C\nD,E,F", (rows) => {
        expect(rows).toContainEqual(["A", "B", "C"]);
        expect(rows).not.toContainEqual(["D", "E", "F"]);
      });
    });
    it("should #2", () => {
      CSV.readChunk('A,B,C\nD,E,"F\n', (rows) => {
        expect(rows).toContainEqual(["A", "B", "C"]);
        expect(rows).not.toContainEqual(["D", "E", "F"]);
      });
    });
    it("should #3", () => {
      CSV.readChunk("A,B,C\nD,E", (rows) => {
        expect(rows).toContainEqual(["A", "B", "C"]);
        expect(rows).not.toContainEqual(["D", "E"]);
      });
    });
  });

  describe("readStream()", () => {
    it("should #1", (done) => {
      const reader = fs.createReadStream(
        path.resolve(__dirname, "./sample.csv")
      );
      const parser = CSV.createStream({ separator: "," });
      const rows: string[] = [];
      parser.on("data", (row) => {
        rows.push(row);
      });
      parser.on("end", () => {
        expect(rows).toEqual(CSV.parse('1,2,"3,3",4\n1,2,3,4'));
        done();
      });
      reader.pipe(parser);
    });
    it("should #2", (done) => {
      const reader = fs.createReadStream(
        path.resolve(__dirname, "./sample.csv"),
        { highWaterMark: 5 }
      );
      const parser = CSV.createStream({ separator: "," });
      const rows: string[] = [];
      parser.on("data", (row) => {
        rows.push(row);
      });
      parser.on("end", () => {
        expect(rows).toEqual(CSV.parse('1,2,"3,3",4\n1,2,3,4'));
        done();
      });
      reader.pipe(parser);
    });
  });
});
