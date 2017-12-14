'use strict';

var Transform = require('stream').Transform;
var Parser = require('./parser.js');

function Streamer(options) {
  Transform.call(this,  {
    readableObjectMode: true,
    writableObjectMode: false,
  });
  this.buffer = '';
  this.sep = (options && options.separator) ? options.separator : undefined;
  this.quo = (options && options.quote) ? options.quote : undefined;
}

Streamer.prototype = Object.create(
  Transform.prototype, { constructor: { value: Streamer }});


Streamer.prototype._transform = function(chunk, encoding, done) {

  this.buffer = this.buffer.concat(chunk.toString());
  if (this.sep === undefined) {
    // try to detect the separator if not provided
    this.sep = require('./csv.js').detect(this.buffer);
  }

  var csv = new Parser(this.buffer, this.sep, this.quo);
  var rows = csv.File();

  if (csv.linePointer !== csv.pointer) {
    rows.pop();
  }
  this.buffer = this.buffer.slice(csv.linePointer);
  if (rows.length > 0) {
    var self = this;
    rows.forEach(function (row) {
        self.push(row);
      }
    )
  }
  done();
}

Streamer.prototype._flush = function (done) {
  var csv = new Parser(this.buffer, this.sep, this.quo);
  var rows = csv.File();
  if (rows.length > 0) {
    var self = this;
    rows.forEach(function (row) {
        self.push(row);
      }
    )
  }
  done();
};

module.exports = Streamer;
