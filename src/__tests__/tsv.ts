import * as fs from "fs";
import * as path from "path";

import * as CSV from "../";

describe("TSV", () => {
  describe("fetch()", () => {
    it("should #1", () => {
      const obj = CSV.fetch("a\tb\tc", "\t");
      expect(obj).toEqual(["a", "b", "c"]);
    });
    it("should #1a", () => {
      const obj = CSV.fetch("a \t,b \t c\n", "\t");
      expect(obj).toEqual(["a ", ",b ", " c"]);
    });
    it("should #1b", () => {
      const obj = CSV.fetch('"a "\t"\tb "\t" c\n"', "\t");
      expect(obj).toEqual(["a ", "\tb ", " c\n"]);
    });
    it("should #1c", () => {
      const obj = CSV.fetch('"a" \t "b" \t "c" \n', "\t");
      expect(obj).toEqual(["a", "b", "c"]);
    });
    it("should #2", () => {
      const obj = CSV.fetch("a\tb\tc\nd\te", "\t");
      expect(obj).toEqual(["a", "b", "c"]);
    });
    it("should #3", () => {
      const obj = CSV.fetch('a\tb\t"c\nd"\te', "\t");
      expect(obj).toEqual(["a", "b", "c\nd", "e"]);
    });
    it("should #4", () => {
      const obj = CSV.fetch('a\tb\t"c\n', "\t");
      expect(obj).toEqual(["a", "b"]);
    });
    it("should #5", () => {
      const obj = CSV.fetch('"a\ta"\t"b\tb"\t"c"', "\t");
      expect(obj).toEqual(["a\ta", "b\tb", "c"]);
    });
    it("should #5b", () => {
      const obj = CSV.fetch('"a\ta" \t  "b\tb"\t"c"', "\t");
      expect(obj).toEqual(["a\ta", "b\tb", "c"]);
    });
    it("should #5c", () => {
      const obj = CSV.fetch('"a\ta"\t\t"c"', "\t");
      expect(obj).toEqual(["a\ta", "", "c"]);
    });
    it("should #6", () => {
      const obj = CSV.fetch("a'a;b;;c\nd\te\tf\tg", ";");
      expect(obj).toEqual(["a'a", "b", "", "c"]);
    });
    it("should #7", () => {
      const obj = CSV.fetch('a\tb\tc\r\n"d"\t"e"\t"f"', "\t");
      expect(obj).toEqual(["a", "b", "c"]);
    });
    it("should #8", () => {
      const obj = CSV.fetch('a\t"b\tb""b\tb""b"\tc\r\nd\te\tf', "\t");
      expect(obj).toEqual(["a", 'b\tb"b\tb"b', "c"]);
    });
    it("should #9", () => {
      const obj = CSV.fetch('a\t"b1\t""b2""b3\tb4"""""\tc\r\nd\te\tf', "\t");
      expect(obj).toEqual(["a", 'b1\t"b2"b3\tb4""', "c"]);
    });
    it("should #10", () => {
      const obj = CSV.fetch('a\t"b1\t""b2""b3\tb4""""b5\r\nb6"\r\nc\td', "\t");
      expect(obj).toEqual(["a", 'b1\t"b2"b3\tb4""b5\r\nb6']);
    });
    it("should #10bis", () => {
      const obj = CSV.fetch('a\t"b1\t""b2""b3\tb4""""b5\nb6"  \r\nc\td', "\t");
      expect(obj).toEqual(["a", 'b1\t"b2"b3\tb4""b5\nb6']);
    });
    it("should #10ter", () => {
      const obj = CSV.fetch('a\t"b1\t""b2""b3\tb4""""b5\nb6" \tc\r\n\td', "\t");
      expect(obj).toEqual(["a", 'b1\t"b2"b3\tb4""b5\nb6', "c"]);
    });
    it("should #11", () => {
      const obj = CSV.fetch('a\t"\tb"\tc\r\n\td', "\t");
      expect(obj).toEqual(["a", "\tb", "c"]);
    });
    it("should #12", () => {
      const obj = CSV.fetch('a\t"b"\tc\r\na\t"b""b"\tc', "\t");
      expect(obj).toEqual(["a", "b", "c"]);
    });
    it("should get simple fields containing double quotes #13", () => {
      const obj = CSV.fetch('a\tthis "should" work\tb', "\t");
      expect(obj).toEqual(["a", 'this "should" work', "b"]);
    });
    it("should get simple fields containing doubled simple quotes #14", () => {
      const obj = CSV.fetch("a\tb''b\tc", "\t");
      expect(obj).toEqual(["a", "b''b", "c"]);
    });
  });
  describe("fetch() with alternative quote and separator", () => {
    it("should #1", () => {
      const obj = CSV.fetch("a|b|c", "|", "#");
      expect(obj).toEqual(["a", "b", "c"]);
    });
    it("should #1a", () => {
      const obj = CSV.fetch("a |,b | c\n", "|", "#");
      expect(obj).toEqual(["a ", ",b ", " c"]);
    });
    it("should #1b", () => {
      const obj = CSV.fetch("#a #|#|b #|# c\n#", "|", "#");
      expect(obj).toEqual(["a ", "|b ", " c\n"]);
    });
    it("should #1c", () => {
      const obj = CSV.fetch("#a# | #b# | #c# \n", "|", "#");
      expect(obj).toEqual(["a", "b", "c"]);
    });
    it("should #2", () => {
      const obj = CSV.fetch("a|b|c\nd|e", "|", "#");
      expect(obj).toEqual(["a", "b", "c"]);
    });
    it("should #3", () => {
      const obj = CSV.fetch("a|b|#c\nd#|e", "|", "#");
      expect(obj).toEqual(["a", "b", "c\nd", "e"]);
    });
    it("should #4", () => {
      const obj = CSV.fetch("a|b|#c\n", "|", "#");
      expect(obj).toEqual(["a", "b"]);
    });
    it("should #5", () => {
      const obj = CSV.fetch("#a|a#|#b|b#|#c#", "|", "#");
      expect(obj).toEqual(["a|a", "b|b", "c"]);
    });
    it("should #5b", () => {
      const obj = CSV.fetch("#a|a# |  #b|b#|#c#", "|", "#");
      expect(obj).toEqual(["a|a", "b|b", "c"]);
    });
    it("should #5c", () => {
      const obj = CSV.fetch("#a|a#||#c#", "|", "#");
      expect(obj).toEqual(["a|a", "", "c"]);
    });
    it("should #6", () => {
      const obj = CSV.fetch("a'a;b;;c\nd|e|f|g", ";");
      expect(obj).toEqual(["a'a", "b", "", "c"]);
    });
    it("should #7", () => {
      const obj = CSV.fetch("a|b|c\r\n#d#|#e#|#f#", "|", "#");
      expect(obj).toEqual(["a", "b", "c"]);
    });
    it("should #8", () => {
      const obj = CSV.fetch("a|#b|b##b|b##b#|c\r\nd|e|f", "|", "#");
      expect(obj).toEqual(["a", "b|b#b|b#b", "c"]);
    });
    it("should #9", () => {
      const obj = CSV.fetch("a|#b1|##b2##b3|b4#####|c\r\nd|e|f", "|", "#");
      expect(obj).toEqual(["a", "b1|#b2#b3|b4##", "c"]);
    });
    it("should #12", () => {
      const obj = CSV.fetch("a|#b#|c\r\na|#b##b#|c", "|", "#");
      expect(obj).toEqual(["a", "b", "c"]);
    });
    it("should get simple fields containing double quotes #13", () => {
      const obj = CSV.fetch("a|this #should# work|b", "|", "#");
      expect(obj).toEqual(["a", "this #should# work", "b"]);
    });
    it("should get simple fields containing doubled simple quotes #14", () => {
      const obj = CSV.fetch("a|b''b|c", "|", "#");
      expect(obj).toEqual(["a", "b''b", "c"]);
    });
  });

  describe("fetch() with separator and no quote", () => {
    it("should #1", () => {
      const obj = CSV.fetch("a\tb\tc", "\t", "\b");
      expect(obj).toEqual(["a", "b", "c"]);
    });
    it("should #2", () => {
      const obj = CSV.fetch('a\t"b"\tc', "\t", "\b");
      expect(obj).toEqual(["a", '"b"', "c"]);
    });
    it("should #3", () => {
      const obj = CSV.fetch('a\t"b"b\tc', "\t", "\b");
      expect(obj).toEqual(["a", '"b"b', "c"]);
    });
  });

  describe("readStream()", () => {
    it("should #1", () => {
      const reader = fs.createReadStream(
        path.resolve(__dirname, "./sample.txt")
      );
      const parser = CSV.createStream({ separator: "|", quote: "#" });
      const rows: string[] = [];
      parser.on("data", (row) => {
        rows.push(row);
      });
      parser.on("end", () => {
        expect(rows).toEqual(CSV.parse("1|2|#3|3#|4\n1|2|3|4", "|", "#"));
      });
      reader.pipe(parser);
    });
    it("should #2", () => {
      const reader = fs.createReadStream(
        path.resolve(__dirname, "./sample.txt"),
        { highWaterMark: 5 }
      );
      const parser = CSV.createStream({ separator: "|", quote: "#" });
      const rows: string[] = [];
      parser.on("data", (row) => {
        rows.push(row);
      });
      parser.on("end", () => {
        // should.deepEqual(rows, CSV.parse("1|2|#3|3#|4\n1|2|3|4", "|", "#"));
        expect(rows).toEqual(CSV.parse("1|2|#3|3#|4\n1|2|3|4", "|", "#"));
      });
      reader.pipe(parser);
    });
  });

  /* */
});
