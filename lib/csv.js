'use strict';

function reducer(item, memo, sep) {
  var foo = ''
  , c = new RegExp(sep, 'g')
  , q = new RegExp('"', 'g')
  , n = new RegExp('\n', 'g');

  if (!item) {
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
  if (memo) {
    foo = memo + sep;
  }
  if (item.search(c) >= 0 || item.search(q) >= 0 || item.search(n) >= 0) {
    foo += '"' + item.replace(q, '""') + '"';
  }
  else {
    foo += ''+item; 
  }
  return foo;
}

exports.eol = "\r\n";
exports.separator = ",";

exports.detect = function(input) 
{
  var separators = [{c: 0, v: ','}, {c: 0, v: ';'}, {c: 0, v: '|'}, {c: 0, v: '\t'}, {c:0, v:null}];
  separators.forEach(function (item, indice) {
      item.c += input.split(item.v).length;
    }
  );
  var max = 0;
  var separator = separators.reduce(function (prev, cur) {
      if (cur.c >= max) {
        max = cur.c;
        return cur.v;
      }
      else {
        return prev;
      }
    }, null
  );
  return separator;
}


exports.stringify = function(input, sep) {
  var ret = '';
  sep = sep || exports.separator;
  if (Array.isArray(input) && !Array.isArray(input[0])) {
    input.forEach(function(item) {
        ret = reducer(item, ret, sep);
    });
    ret += exports.eol;
  }
  else if (Array.isArray(input) && Array.isArray(input[0])) {
    input.forEach(function(item, index) {
        ret += exports.stringify(item, sep);
    });
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

exports.parse = function(input, sep) {

  var output = [];
  exports.forEach(input, sep, function(row, index) {
      output.push(row);
  })
  return output;
}


exports.forEach = function(input, sep, callback) {
  if (arguments.length < 3) {
    callback = sep;
    sep = ',';
  }
  var i = 0, s = 0, r;
  while(r = exports.read(input.slice(s), sep, function(fields) {
        callback(fields, i++);
      }
  )) s += r;
}

exports.read = function(input, sep, callback) {
  sep = sep || ",";
  var fields = [], reminderIndex = 0, token = '', endingIndex = 0, endingLine = 0, startingIndex = 0,
      sepx = new RegExp('[^\\s'+sep+']+.');

//    console.log('input:', input);
//    console.log('input.length:', input.length);
//    console.log('sep:', sep);
  while (startingIndex <= input.length ) {
    endingIndex = input.indexOf(sep, startingIndex);
    endingLine = input.indexOf('\n', startingIndex);
//        console.log('startingIndex:', startingIndex);
//        console.log('endingIndex:', endingIndex);
//        console.log('endingLine:', endingLine);

    if (endingIndex < 0) {
      endingIndex = input.length;
    }
    token = input.slice(startingIndex, endingIndex).trim();
//        console.log('token:', token);
    if (token.charAt(0) == '"' && token.charAt(token.length - 1) == '"') {
      // D : "token"
      fields.push(token.slice(1, -1));
      startingIndex = endingIndex + 1;
    }
    else if (token.charAt(0) == '"') {
      // A : "token
      //
      var s = input.slice(startingIndex + 1);
      if (s.indexOf('"') < 0) {
        reminderIndex = startingIndex;
        callback(fields);
        return reminderIndex;
      }
      else {
        var i = s.search(/[^\"]\"(?!\")/) + 1;
      fields.push(input.slice(startingIndex + 1, startingIndex + i + 1));
      var j = input.slice(startingIndex + i + 2).search(sepx);
      startingIndex += i + 2 + (j >= 0 ? j : 0);
    }
  }
  else if (endingLine >= 0 && endingLine < endingIndex) {
    if (input.charAt(endingLine - 1) === '\r') {
      fields.push(input.slice(startingIndex, endingLine - 1));
    }
    else {
      fields.push(input.slice(startingIndex, endingLine));
    }
    reminderIndex = endingLine + 1;
    callback(fields);
    return reminderIndex;
  }
  else if (token.charAt(token.length - 1) == '"') {
    // C : token"
  
    fields.push(input.slice(startingIndex, endingIndex));
    startingIndex = endingIndex + 1;
  }
  else {
    // B : token
    //      console.log(endingLine, '<', endingIndex);
    fields.push(input.slice(startingIndex, endingIndex));
    startingIndex = endingIndex + 1;
  }
}
reminderIndex = null;
callback(fields);
return reminderIndex;
}

exports.fetch = function(input, sep) {

  var output;
  exports.read(input, sep, function(fields) {
      output = fields;
  });
  return output;

}
