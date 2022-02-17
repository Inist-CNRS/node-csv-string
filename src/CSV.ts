import { Parser } from './Parser';
import { Streamer } from './Streamer';
import {
  Comma,
  ForEachCallback,
  LineBreak,
  PristineInput,
  Quote,
  ReadAllCallback,
  ReadCallback,
  Value,
  ParseOptions,
} from './types';

const EOL: LineBreak = '\r\n';
const SEPARATOR: Comma = ',';

const quoteCharReqex = new RegExp('"', 'g');
const specialCharReqex = new RegExp('["\r\n]', 'g');
const _shouldBeQuoted = (value: string, sep: string): boolean =>
  value.search(specialCharReqex) >= 0 || value.includes(sep);
const _quoteIfRquired = (value: string, sep: string): string =>
  _shouldBeQuoted(value, sep)
    ? '"' + value.replace(quoteCharReqex, '""') + '"'
    : value;
const _stringifySingleValue = (item: PristineInput): string => {
  if (item === 0) {
    item = '0';
  } else if (item === undefined || item === null) {
    item = '';
  }
  if (typeof item != 'string') {
    const s = item.toString();
    if (s == '[object Object]') {
      item = JSON.stringify(item);
      if (item == '{}') {
        item = '';
      }
    } else {
      item = s;
    }
  }
  return item;
};
const reducer = (
  item: PristineInput,
  memo: PristineInput | undefined,
  sep: Comma,
  prependSep?: boolean
): Value => {
  item = _stringifySingleValue(item);
  return (
    (memo !== undefined || prependSep ? `${memo}${sep}` : '') +
    _quoteIfRquired(item, sep)
  );
};

const detect = (input: string): Comma => {
  const separators = [',', ';', '|', '\t'];
  const idx = separators
    .map((separator) => input.indexOf(separator))
    .reduce((prev, cur) =>
      prev === -1 || (cur !== -1 && cur < prev) ? cur : prev
    );
  return (input[idx] || ',') as Comma;
};

const stringify = (input?: PristineInput, sep: Comma = SEPARATOR): string => {
  let ret: string | undefined;
  sep = sep || SEPARATOR;
  if (Array.isArray(input)) {
    if (input.length === 0) {
      ret = EOL;
    } else if (!Array.isArray(input[0])) {
      for (let loop = 0; loop < input.length; loop++) {
        ret = reducer(input[loop], ret, sep, loop > 0);
      }
      ret += EOL;
    } else if (Array.isArray(input[0])) {
      ret = input.map((item) => stringify(item, sep)).join('');
    }
  } else if (typeof input == 'object') {
    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        ret = reducer(input[key], ret, sep);
      }
    }
    ret += EOL;
  } else {
    ret = reducer(input, ret, sep) + EOL;
  }
  return ret as string;
};

function parse(input: string, sep?: Comma, quo?: Quote): Value[][];
function parse(input: string, opts?: Partial<ParseOptions & { output: 'tuples' }>): Value[][];
function parse(
  input: string,
  opts: Partial<ParseOptions> & { output: 'objects' }
): { [k: string]: Value }[];
function parse(
  input: string,
  sepOrOpts?: Comma | Partial<ParseOptions>,
  quo?: Quote
): Value[][] | { [k: string]: Value }[] {
  // Create an options hash, using positional parameters or the passed in options hash for values
  const opts: Partial<ParseOptions> = typeof sepOrOpts === "object" ? sepOrOpts : {};
  if (typeof sepOrOpts === "string") {
    opts.comma = sepOrOpts as Comma;
  }
  if (quo) {
    opts.quote = quo as Quote;
  }

  // try to detect the separator if not provided
  if (opts.comma === undefined) {
    opts.comma = detect(input);
  }

  // Clean characters, if necessary
  // TODO: We should probably throw an error here to signal bad input to the user
  if (opts.comma) {
    opts.comma = opts.comma[0] as Comma;
  }
  if (opts.quote) {
    opts.quote = opts.quote[0] as Quote;
  }

  const csv = new Parser(input, opts.comma, opts.quote);
  return csv.File(opts.output);
};

function read(input: string, callback: ReadCallback): number;
function read(input: string, sep: Comma, callback: ReadCallback): number;
function read(
  input: string,
  sep: Comma,
  quo: Quote,
  callback: ReadCallback
): number;
function read(
  input: string,
  sep: Comma | ReadCallback,
  quo?: Quote | ReadCallback,
  callback?: ReadCallback
): number {
  if (callback === undefined) {
    if (quo === undefined) {
      // arguments.length < 3) {
      if (typeof sep !== 'function') {
        throw Error('Last/second argument is not a callback');
      }
      callback = sep;
      sep = ',';
    } else {
      // arguments.length < 4) {
      if (typeof quo !== 'function') {
        throw Error('Last/third argument is not a callback');
      }
      callback = quo;
      quo = '"';
    }
  }
  const csv = new Parser(input, sep as Comma, quo as Quote);
  const fields = csv.Row();
  callback(fields);
  return csv.pointer;
}

function forEach(input: string, callback: ForEachCallback): void;
function forEach(input: string, sep: Comma, callback: ForEachCallback): void;
function forEach(
  input: string,
  sep: Comma,
  quo: Quote,
  callback: ForEachCallback
): void;
function forEach(
  input: string,
  sep: Comma | ForEachCallback,
  quo?: Quote | ForEachCallback,
  callback?: ForEachCallback
): void {
  if (callback === undefined) {
    if (quo === undefined) {
      // arguments.length < 3) {
      if (typeof sep !== 'function') {
        throw Error('Last/second argument is not a callback');
      }
      callback = sep;
      sep = ',';
    } else {
      // arguments.length < 4) {
      if (typeof quo !== 'function') {
        throw Error('Last/third argument is not a callback');
      }
      callback = quo;
      quo = '"';
    }
  }
  let i = 0;
  let s = 0;
  let r: number;
  while (
    (r = read(input.slice(s), sep as Comma, quo as Quote, (fields) =>
      (callback as ForEachCallback)(fields, i++)
    ))
  ) {
    s += r;
  }
}

function readAll(input: string, callback: ReadAllCallback): number;
function readAll(input: string, sep: Comma, callback: ReadAllCallback): number;
function readAll(
  input: string,
  sep: Comma,
  quo: Quote,
  callback: ReadAllCallback
): number;
function readAll(
  input: string,
  sep: Comma | ReadAllCallback,
  quo?: Quote | ReadAllCallback,
  callback?: ReadAllCallback
): number {
  if (callback === undefined) {
    if (quo === undefined) {
      // arguments.length < 3) {
      if (typeof sep !== 'function') {
        throw Error('Last/second argument is not a callback');
      }
      callback = sep;
      sep = ',';
    } else {
      // arguments.length < 4) {
      if (typeof quo !== 'function') {
        throw Error('Last/third argument is not a callback');
      }
      callback = quo;
      quo = '"';
    }
  }
  const csv = new Parser(input, sep as Comma, quo as Quote);
  const rows = csv.File();
  callback(rows);
  return csv.pointer;
}

function readChunk(input: string, callback: ReadAllCallback): number;
function readChunk(
  input: string,
  sep: Comma,
  callback: ReadAllCallback
): number;
function readChunk(
  input: string,
  sep: Comma,
  quo: Quote,
  callback: ReadAllCallback
): number;
function readChunk(
  input: string,
  sep: Comma | ReadAllCallback,
  quo?: Quote | ReadAllCallback,
  callback?: ReadAllCallback
): number {
  if (callback === undefined) {
    if (quo === undefined) {
      // arguments.length < 3) {
      if (typeof sep !== 'function') {
        throw Error('Last/second argument is not a callback');
      }
      callback = sep;
      sep = ',';
    } else {
      // arguments.length < 4) {
      if (typeof quo !== 'function') {
        throw Error('Last/third argument is not a callback');
      }
      callback = quo;
      quo = '"';
    }
  }
  const csv = new Parser(input, sep as Comma, quo as Quote);
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
}

const fetch = (input: string, sep?: Comma, quo?: Quote): Value[] => {
  // TODO
  let output: Value[] | undefined;
  read(input, sep as Comma, quo as Quote, (fields) => {
    output = fields;
  });
  return output as Value[];
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
