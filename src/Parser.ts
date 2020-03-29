/*
file
  :  row+ EOF
  ;
row
  :  value (Comma value)* (LineBreak | EOF)
  ;
value
  :  SimpleValue
  |  QuotedValue
  ;
Comma
  :  ','
  ;
LineBreak
  :  '\r'? '\n'
  |  '\r'
  ;
SimpleValue
  :  ~(',' | '\r' | '\n' | '"')+
  ;
QuotedValue
  :  Residue '"' ('""' | ~'"')* '"' Residue
  ;

Residue
  : (' ' | '\t' | '\f')*
*/

type LineBreak = "\r\n" | "\n" | "\r";
type Comma = "," | string;
type Quote = '"' | string;
type Residue = " " | "\t" | "\f" | string;
type Value = string;

export class Parser {
  quote!: string;
  input!: string;
  pointer!: number;
  linePointer!: number;
  comma!: string;
  _residueRegExp!: RegExp;
  _simpleValueRegExp!: RegExp;
  _replaceQuoteRegExp!: RegExp;

  constructor(input: string, comma?: Comma, quote?: Quote) {
    if (!(this instanceof Parser)) {
      return new Parser(input, comma);
    }
    this.input = input;
    this.pointer = 0;
    this.linePointer = 0;
    this.comma = (comma && comma[0]) || ",";
    this.quote = (quote && quote[0]) || '"';
    // initialize RegExp Object
    let chars =
      " \f\v\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000";
    if (this.comma !== "\t") {
      chars += "\t";
    }
    this._residueRegExp = new RegExp("[^" + chars + "]");
    this._simpleValueRegExp = new RegExp("[" + this.comma + "\r\n]");
    this._replaceQuoteRegExp = new RegExp(this.quote + this.quote, "g");
  }

  File(): Value[][] {
    const files: Value[][] = [];
    let row: Value[];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const tempointer = this.pointer;
      row = this.Row();
      if (row.length > 0) {
        this.linePointer = tempointer;
        files.push(row);
      } else {
        if (this.linePointer && this.pointer !== this.input.length) {
          files.pop();
          this.pointer = this.linePointer;
        }
        break;
      }
      if (this.EOF()) {
        if (this.linePointer && this.pointer !== this.input.length) {
          files.pop();
          this.pointer = this.linePointer;
        }
        break;
      }
    }
    return files;
  }

  Row(): Value[] {
    const row: Value[] = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      row.push(this.Value() || "");
      if (this.Comma()) {
        continue;
      }
      if (this.LineBreak() || this.EOF()) {
        return row;
      } else {
        row.pop();
        return row;
      }
    }
  }

  Value(): Value | undefined {
    const residue = this.Residue();
    const quotedvalue = this.QuotedValue();
    if (quotedvalue) {
      const value = quotedvalue
        .slice(1, -1)
        .replace(this._replaceQuoteRegExp, this.quote);
      this.Residue();
      return value;
    }
    const simplevalue = this.SimpleValue();
    if (simplevalue) {
      return residue ? residue + simplevalue : simplevalue;
    }
  }

  Comma(): Comma | undefined {
    if (
      this.input.slice(this.pointer, this.pointer + this.comma.length) ===
      this.comma
    ) {
      this.pointer += this.comma.length;
      return this.comma;
    }
  }

  LineBreak(): LineBreak | undefined {
    if (this.input.slice(this.pointer, this.pointer + 2) === "\r\n") {
      this.pointer += 2;
      return "\r\n";
    }
    if (this.input.charAt(this.pointer) === "\n") {
      this.pointer += 1;
      return "\n";
    }
    if (this.input.charAt(this.pointer) === "\r") {
      this.pointer += 1;
      return "\r";
    }
  }

  SimpleValue(): Value | undefined {
    let value = "";
    const index = this.input
      .slice(this.pointer)
      .search(this._simpleValueRegExp);
    if (this.input.charAt(this.pointer) === this.quote) {
      return;
    } else if (index === -1) {
      value = this.input.slice(this.pointer);
    } else if (index === 0) {
      return;
    } else {
      value = this.input.slice(this.pointer, this.pointer + index);
    }
    this.pointer += value.length;
    return value;
  }

  QuotedValue(): Value | undefined {
    if (this.input.charAt(this.pointer) === this.quote) {
      let searchIndex,
        index = 1;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        searchIndex = this.input.slice(this.pointer + index).search(this.quote);
        if (searchIndex === -1) {
          return;
        }
        if (
          this.input.charAt(this.pointer + index + searchIndex + 1) ===
          this.quote
        ) {
          index += searchIndex + 2;
          continue;
        }
        const value = this.input.slice(
          this.pointer,
          this.pointer + index + searchIndex + 1
        );
        this.pointer += value.length;
        return value;
      }
    }
  }

  EOF(): boolean {
    return this.pointer >= this.input.length;
  }

  Residue(): Residue {
    let value = "";
    const index = this.input.slice(this.pointer).search(this._residueRegExp);
    if (index === -1) {
      value = this.input.slice(this.pointer);
    } else if (index === 0) {
      return "";
    } else {
      value = this.input.slice(this.pointer, this.pointer + index);
    }
    this.pointer += value.length;
    return value;
  }
}

// module.exports = Parser;
