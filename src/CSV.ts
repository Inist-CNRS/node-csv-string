import { Parser } from "./Parser";
import { Streamer } from "./Streamer";

const reducer = (item, memo, sep, prependSep?): string => {
  let foo = "";
  const c = new RegExp(sep, "g"),
    q = new RegExp('"', "g"),
    // eslint-disable-next-line no-control-regex
    n = new RegExp("\n", "g");

  if (item === 0) {
    item = "0";
  } else if (item === undefined || item === null) {
    item = "";
  }
  if (typeof item != "string") {
    const s = item.toString();
    if (s == "[object Object]") {
      item = JSON.stringify(item);
      if (item == "{}") {
        item = "";
      }
    } else {
      item = s;
    }
  }
  if (memo !== undefined || prependSep) {
    foo = memo + sep;
  }
  if (item.search(c) >= 0 || item.search(q) >= 0 || item.search(n) >= 0) {
    foo += '"' + item.replace(q, '""') + '"';
  } else {
    foo += "" + item;
  }
  return foo;
};

const EOL = "\r\n";
const SEPARATOR = ",";
const QUOTE = '"';

// TODO: return type Separator = "," | ";" | "|" | "\t";
const detect = (input): string => {
  const separators = [",", ";", "|", "\t"];
  const idx = separators
    .map((separator) => {
      return input.indexOf(separator);
    })
    .reduce((prev, cur) => {
      if (prev === -1 || (cur !== -1 && cur < prev)) {
        return cur;
      } else {
        return prev;
      }
    });
  return input[idx] || ",";
};

const stringify = (input?, sep = SEPARATOR): string => {
  let ret;
  sep = sep || SEPARATOR;
  if (Array.isArray(input) && input.length === 0) {
    ret = EOL;
  } else if (Array.isArray(input) && !Array.isArray(input[0])) {
    for (let loop = 0; loop < input.length; loop++) {
      ret = reducer(input[loop], ret, sep, loop > 0);
    }
    ret += EOL;
  } else if (Array.isArray(input) && Array.isArray(input[0])) {
    ret = "";
    input.forEach((item) => {
      ret += stringify(item, sep);
    });
  } else if (typeof input == "object") {
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        ret = reducer(input[key], ret, sep);
      }
    }
    ret += EOL;
  } else {
    ret = reducer(input, ret, sep) + EOL;
  }
  return ret;
};

const parse = (input, sep?, quo?): string[][] => {
  if (sep === undefined) {
    // try to detect the separator if not provided
    sep = detect(input);
  }
  const csv = new Parser(input, sep, quo);
  return csv.File();
};

const read = function (input, sep, quo?, callback?): number {
  if (arguments.length < 3) {
    callback = sep;
    sep = ",";
  } else if (arguments.length < 4) {
    callback = quo;
    quo = '"';
  }
  const csv = new Parser(input, sep, quo);
  const fields = csv.Row();
  callback(fields);
  return csv.pointer;
};

const forEach = function (input, sep, quo?, callback?): void {
  if (arguments.length < 3) {
    callback = sep;
    sep = ",";
  } else if (arguments.length < 4) {
    callback = quo;
    quo = '"';
  }
  let i = 0,
    s = 0,
    r;
  while (
    (r = read(input.slice(s), sep, quo, (fields) => {
      callback(fields, i++);
    }))
  ) {
    s += r;
  }
};

const readAll = function (input, sep, quo?, callback?): number {
  if (arguments.length < 3) {
    callback = sep;
    sep = SEPARATOR;
  } else if (arguments.length < 4) {
    callback = quo;
    quo = QUOTE;
  }
  const csv = new Parser(input, sep, quo);
  const rows = csv.File();
  callback(rows);
  return csv.pointer;
};

const readChunk = function (input, sep, quo?, callback?): number {
  if (arguments.length < 3) {
    callback = sep;
    sep = ",";
  } else if (arguments.length < 4) {
    callback = quo;
    quo = '"';
  }
  const csv = new Parser(input, sep, quo);
  const rows = csv.File();
  let ret = 0;
  if (csv.pointer < input.length) {
    ret = csv.pointer;
  } else {
    rows.pop();
    ret = csv.linePointer;
  }
  callback(rows);
  return ret;
};

const fetch = (input, sep?, quo?): number => {
  let output;
  read(input, sep, quo, (fields) => {
    output = fields;
  });
  return output;
};

const createStream = (options?: {
  separator?: string;
  quote?: string;
}): Streamer => new Streamer(options);

export {
  EOL as eol,
  SEPARATOR as separator,
  detect,
  stringify,
  parse,
  read,
  forEach,
  readAll,
  readChunk,
  fetch,
  createStream,
};
