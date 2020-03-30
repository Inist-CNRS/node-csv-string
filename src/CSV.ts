import { Parser } from "./Parser";
import { Streamer } from "./Streamer";
import { Comma, Quote, LineBreak } from "./types";

const EOL: LineBreak = "\r\n";
const SEPARATOR: Comma = ",";
const QUOTE: Quote = '"';

const quoteCharReqex = new RegExp('"', "g");
const specialCharReqex = new RegExp('["\r\n]', "g");
const _shouldBeQuoted = (value: string, sep: string): boolean =>
  value.search(specialCharReqex) >= 0 || value.includes(sep);
const _quoteIfRquired = (value: string, sep: string): string =>
  _shouldBeQuoted(value, sep)
    ? '"' + value.replace(quoteCharReqex, '""') + '"'
    : value;
const _stringifySingleValue = (
  item: string | number | null | undefined | object
): string => {
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
  return item;
};
const reducer = (item, memo, sep, prependSep?): string => {
  item = _stringifySingleValue(item);
  return (
    (memo !== undefined || prependSep ? `${memo}${sep}` : "") +
    _quoteIfRquired(item, sep)
  );
};

const detect = (input): Comma => {
  const separators = [",", ";", "|", "\t"];
  const idx = separators
    .map((separator) => input.indexOf(separator))
    .reduce((prev, cur) =>
      prev === -1 || (cur !== -1 && cur < prev) ? cur : prev
    );
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
  let i = 0;
  let s = 0;
  let r: number;
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
  separator?: Comma;
  quote?: Quote;
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
