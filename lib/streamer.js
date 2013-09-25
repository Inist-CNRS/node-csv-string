'use strict';

var Writable = require('stream').Writable;
var Parser = require('./parser.js');

function Streamer(options) {
  Writable.call(this, options);
  this.buffer = '';
  this.sep = (options && options.separator) ? options.separator : ',';
}

Streamer.prototype = Object.create(
  Writable.prototype, { constructor: { value: Streamer }});


Streamer.prototype._write = function (chunk, encoding, done) {

  this.buffer = this.buffer.concat(chunk.toString());

  var csv = new Parser(this.buffer, this.sep);
  var rows = csv.File();

  if (csv.pointer < this.buffer.length) {
    this.buffer = this.buffer.slice(csv.pointer);
  }
  else {
    rows.pop();
    this.buffer = this.buffer.slice(csv.linePointer);
  }
  if (rows.length > 0) {
    var self = this;
    rows.forEach(function (row) {
        self.emit('data', row);
      }
    )
  }
  done();
}

Streamer.prototype.end = function () {
  var csv = new Parser(this.buffer, this.sep);
  var rows = csv.File();
  if (rows.length > 0) {
    var self = this;
    rows.forEach(function (row) {
        self.emit('data', row);
      }
    )
  }
  this.emit('end');
};

module.exports = Streamer;
