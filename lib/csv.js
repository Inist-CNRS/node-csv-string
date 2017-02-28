'use strict';
var Parser = require('./parser.js');
var Streamer = require('./streamer.js');

function reducer(item, memo, sep, prependSep) {
  var foo = ''
  , c = new RegExp(sep, 'g')
  , q = new RegExp('"', 'g')
  , n = new RegExp('\n', 'g');

  if (item === 0) {
    item = '0';
  }
  else if (item === undefined || item ===  null) {
    item = '';
  }
  if (typeof item != 'string') {
    var s = item.toString();
    if (s == '[object Object]') {
      item = JSON.stringify(item);
      if (item == '{}') {
        item = '';
      }
    }
    else {
      item = s;
    }
  }
  if (memo !== undefined || prependSep) {
    foo = memo + sep;
  }
  if (item.search(c) >= 0 || item.search(q) >= 0 || item.search(n) >= 0) {
    foo += '"' + item.replace(q, '""') + '"';
  }
  else {
    foo += '' + item;
  }
  return foo;
}

exports.eol = "\r\n";
exports.separator = ",";

exports.detect = function detect (input)
{
  var separators = [',', ';', '|', '\t'];
  var idx = separators.map(function (separator) {
    return input.indexOf(separator);
  }).reduce(function (prev, cur) {
    if (prev === -1 || cur !== -1 && cur < prev) {
      return cur;
    }
    else {
      return prev;
    }
  });
  return input[idx] || ',';
}


exports.stringify = function (input, sep) {
  var ret;
  sep = sep || exports.separator;
  if (Array.isArray(input) && !Array.isArray(input[0])) {
    for (var loop = 0; loop < input.length; loop++) {
      ret = reducer(input[loop], ret, sep, loop > 0);
    }
    ret += exports.eol;
  }
  else if (Array.isArray(input) && Array.isArray(input[0])) {
    ret = '';
    input.forEach(function (item, index) {
        ret += exports.stringify(item, sep);
      }
    );
  }
  else if (typeof input == 'object') {
    for (var key in input) {
      if (input.hasOwnProperty(key)) {
        ret = reducer(input[key], ret, sep);
      }
    }
    ret += exports.eol;
  }
  else {
    ret = reducer(input, ret, sep) + exports.eol;
  }
  return ret;
}

exports.parse = function (input, sep) {
  if (sep === undefined) {
    // try to detect the separator if not provided
    sep = exports.detect(input);
  }

  var csv = new Parser(input, sep);
  return csv.File();
}


exports.forEach = function (input, sep, callback) {
  if (arguments.length < 3) {
    callback = sep;
    sep = ',';
  }
  var i = 0, s = 0, r;
  while (r = exports.read(input.slice(s), sep, function (fields) {
        callback(fields, i++);
      }
    )
  ) {
    s += r;
  }
}

exports.read = function (input, sep, callback) {
  if (arguments.length < 3) {
    callback = sep;
    sep = ',';
  }
  var csv = new Parser(input, sep);
  var fields = csv.Row();
  callback(fields);
  return csv.pointer;
}

exports.readAll = function (input, sep, callback) {
  if (arguments.length < 3) {
    callback = sep;
    sep = ',';
  }
  var csv = new Parser(input, sep);
  var rows = csv.File();
  callback(rows);
  return csv.pointer;
}

exports.readChunk = function (input, sep, callback) {
  if (arguments.length < 3) {
    callback = sep;
    sep = ',';
  }
  var csv = new Parser(input, sep);
  var rows = csv.File();
  var ret = 0;
  if (csv.pointer < input.length) {
    ret = csv.pointer;
  }
  else {
    rows.pop();
    ret = csv.linePointer;
  }
  callback(rows);
  return ret;
}



exports.fetch = function (input, sep) {
  var output;
  exports.read(input, sep, function (fields) {
      output = fields;
    }
  );
  return output;

}

exports.createStream = function (options) {
  return new Streamer(options);
}


