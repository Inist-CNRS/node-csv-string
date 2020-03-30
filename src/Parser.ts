/*
file:         row + EOF;
row:          value (Comma value)* (LineBreak | EOF);
value:        SimpleValue | QuotedValue;
Comma:        ',';
LineBreak:    '\r'?'\n' | '\r';
SimpleValue:  ~(',' | '\r' | '\n' | '"')+;
QuotedValue:  Residue '"' ('""' | ~'"')* '"' Residue;
Residue:      (' ' | '\t' | '\f')*
*/

import { LineBreak, Comma, Quote, Residue, Value } from "./types";

export class Parser {
  input!: string;
  quote!: Quote;
  comma!: Comma;
  pointer!: number;
  linePointer!: number;
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
    this.comma = (comma && (comma[0] as Comma)) || ",";
    this.quote = (quote && (quote[0] as Quote)) || '"';
    // initialize RegExp Object
    let residueChars =
      " \f\v\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000";
    if (this.comma !== "\t") {
      residueChars += "\t";
    }
    this._residueRegExp = new RegExp(`[^${residueChars}]`);
    this._simpleValueRegExp = new RegExp(`[${this.comma}\r\n]`);
    this._replaceQuoteRegExp = new RegExp(this.quote + this.quote, "g");
  }

  File(): Value[][] {
    const files: Value[][] = [];
    let row: Value[];
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
    while (true) {
      row.push(this.Value());
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

  private Value(): Value {
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
    return "";
  }

  private Comma(): Comma | undefined {
    if (
      this.input.slice(this.pointer, this.pointer + this.comma.length) ===
      this.comma
    ) {
      this.pointer += this.comma.length;
      return this.comma;
    }
  }

  private LineBreak(): LineBreak | undefined {
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

  private SimpleValue(): Value | undefined {
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

  private QuotedValue(): Value | undefined {
    if (this.input.charAt(this.pointer) === this.quote) {
      let searchIndex;
      let index = 1;
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

  private EOF(): boolean {
    return this.pointer >= this.input.length;
  }

  private Residue(): Residue {
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
