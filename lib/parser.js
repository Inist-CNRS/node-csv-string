/*jshint node:true,laxcomma:true*/
'use strict';

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

function Parser(input, comma) {
  if (!(this instanceof Parser)) {
    return new Parser(input, comma);
  }
  this.input = input;
  this.pointer = 0;
  this.linePointer = 0;
  this.comma = comma || ',';
}

Parser.prototype.File = function () {
  var files = [], row, eof;
  while (1) {
    var tempointer = this.pointer;
    row = this.Row();
    if (row.length > 0) {
      this.linePointer = tempointer;
      files.push(row);
    }
    else {
      if (this.linePointer && this.pointer !== this.input.length) {
        files.pop();
        this.pointer = this.linePointer;
      }
      break;
    }
    eof = this.EOF();
    if (eof) {
      if (this.linePointer && this.pointer !== this.input.length) {
        files.pop();
        this.pointer = this.linePointer;
      }
      break;
    }
  }
  return files;
};

Parser.prototype.Row = function () {
  var value, comma, linebreak, eof, row = [];
  while (1) {
    value = this.Value();
    if (!value) {
      row.push('');
    }
    else {
      row.push(value);
    }
    comma = this.Comma();
    if (comma) {
      continue;
    }
    linebreak = this.LineBreak();
    eof = this.EOF();
    if (linebreak || eof) {
      return row;
    }
    else {
      row.pop();
      return row;
    }
  }
};
Parser.prototype.Value = function () {
  var simplevalue, quotedvalue, residue;

  residue = this.Residue();
  quotedvalue = this.QuotedValue();
  if (quotedvalue) {
    var value = quotedvalue.slice(1, -1).replace(/\"\"/g, '"');
    this.Residue();
    return value;
  }
  simplevalue = this.SimpleValue();
  if (simplevalue && residue) {
    return residue + simplevalue;
  }
  else if (simplevalue && !residue) {
    return simplevalue;
  }

};
Parser.prototype.Comma = function () {
  if (this.input.slice(this.pointer, this.pointer + this.comma.length) === this.comma) {
    this.pointer += this.comma.length;
    return this.comma;
  }
};
Parser.prototype.LineBreak = function () {
  if (this.input.slice(this.pointer, this.pointer + 2) === '\r\n') {
    this.pointer += 2;
    return '\r\n';
  }
  if (this.input.charAt(this.pointer) === '\n') {
    this.pointer += 1;
    return '\n';
  }
  if (this.input.charAt(this.pointer) === '\r') {
    this.pointer += 1;
    return '\r';
  }
};
Parser.prototype.SimpleValue = function () {
  var value = '', index = this.input.slice(this.pointer).search(new RegExp('[' + this.comma + '\r\n]'));
  if (this.input.charAt(this.pointer) === '"') {
    return;
  }
  else if (index === -1) {
    value = this.input.slice(this.pointer);
  }
  else if (index === 0) {
    return;
  }
  else {
    value = this.input.slice(this.pointer, this.pointer + index);
  }
  this.pointer += value.length;
  return value;
};
Parser.prototype.QuotedValue = function () {
  if (this.input.charAt(this.pointer) === '"') {
    var searchIndex, index = 1;
     while (1) {
      searchIndex = this.input.slice(this.pointer + index).search('"');
      if (searchIndex === -1) {
        return;
      }
      if (this.input.charAt(this.pointer + index + searchIndex + 1) === '"') {
        index += searchIndex + 2;
        continue;
      }
      var value = this.input.slice(this.pointer, this.pointer + index + searchIndex + 1);
      this.pointer += value.length;
      return value;
    }
  }
};
Parser.prototype.EOF = function () {
  return (this.pointer >= this.input.length);
};
Parser.prototype.Residue = function () {
  var value = ''
    , chars = ' \f\v\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000';

  if (this.comma !== "\t") {
    chars += "\t";
  }
  var index = this.input.slice(this.pointer).search(new RegExp('[^' + chars + ']'));
  if (index === -1) {
    value = this.input.slice(this.pointer);
  }
  else if (index === 0) {
    return;
  }
  else {
    value = this.input.slice(this.pointer, this.pointer + index);
  }
  this.pointer += value.length;
  return value;
};

module.exports = Parser;

