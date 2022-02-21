# Javascript CSV Strings

[![Build Status](https://travis-ci.org/Inist-CNRS/node-csv-string.png?branch=master)](https://travis-ci.org/Inist-CNRS/node-csv-string)

Parse and Stringify for CSV strings.

- API similar to the JSON parser (`CSV.parse` and `CSV.stringify`).
- Can also work row by row.
- Can also be used to parse strings from readable streams (e.g. file streams).
- Tolerant with the weird data
- Written in TypeScript

```js
import * as CSV from 'csv-string';

// with String
const arr = CSV.parse('a,b,c\na,b,c');
const str = CSV.stringify(arr);

// with Stream
const stream = CSV.createStream();
stream.on('data', rows => {
  process.stdout.write(CSV.stringify(rows, ','));
});
process.stdin.pipe(stream);
```

## Contributors

- [Kael Shipman](https://github.com/kael-shipman)
- [Mehul Mohan](https://github.com/mehulmpt)
- [Hossam Magdy](https://github.com/hossam-magdy)
- [Rich](https://github.com/rich-TIA)
- [Rick Huizinga](https://github.com/rickhuizinga)
- [Nicolas Thouvenin](https://github.com/touv)
- [Stéphane Gully](https://github/kerphi)
- [J. Baumbach](https://github.com/jbaumbach)
- [Sam Hauglustaine](https://github.com/smhg)
- [Rick Huizinga](https://github.com/rickhuizinga)
- [doleksy1](https://github.com/doleksy1)
- [François Parmentier](https://github.com/parmentf)

## Installation

using [npm](http://npmjs.org):

```bash
npm install csv-string
```

or [yarn](https://yarnpkg.com/)

```bash
yarn add csv-string
```

## API Documentation

### parse(input: String, [options: Object]): Object
### parse(input: string, [separator: string], [quote: string]): Object

Converts a CSV string `input` to array output.


Options :

-   `comma` **String** to indicate the CSV separator. (optional, default `,`)
-   `quote` **String** to indicate the CSV quote if need. (optional, default `"`)
-   `output` **String** choose 'objects' or 'tuples' to change output for Array or Object. (optional, default `tuples`)


Example 1 :

```js
const CSV = require('csv-string');
const parsedCsv = CSV.parse('a;b;c\nd;e;f', ';');
console.log(parsedCsv);
```

Output:

```json
[
  ["a", "b", "c"],
  ["d", "e", "f"]
]
```

Example 2 :

```js
const CSV = require('csv-string');
const parsedCsv = CSV.parse('a,b,c\n1,2,3\n4,5,6', { output: 'objects' });
console.log(parsedCsv);
```

Output:

```json
[
  { a: '1', b: '2', c: '3' },
  { a: '4', b: '5', c: '6' }
]
```


If separator parameter is not provided, it is automatically detected.

### stringify(input: Object, [separator: string]): string

Converts object `input` to a CSV string.

```js
import * as CSV from 'csv-string';

console.log(CSV.stringify(['a', 'b', 'c']));
console.log(
  CSV.stringify([
    ['c', 'd', 'e'],
    ['c', 'd', 'e']
  ])
);
console.log(CSV.stringify({ a: 'e', b: 'f', c: 'g' }));
```

Output:

```txt
a,b,c

c,d,e
c,d,e

e,f,g
```

### detect(input: string): string

Detects the best separator.

```js
import * as CSV from 'csv-string';

console.log(CSV.detect('a,b,c'));
console.log(CSV.detect('a;b;c'));
console.log(CSV.detect('a|b|c'));
console.log(CSV.detect('a\tb\tc'));
```

Output:

```txt
,
;
|
\t
```

### forEach(input: string, sep: string, quo: string, callback: function)

### forEach(input: string, sep: string, callback: function)

### forEach(input: string, callback: function)

_callback(row: array, index: number): void_

Calls `callback` for each CSV row/line. The Array passed to callback contains the fields of the current row.

```js
import * as CSV from 'csv-string';

const data = 'a,b,c\nd,e,f';

CSV.forEach(data, ',', function (row, index) {
  console.log('#' + index + ' : ', row);
});
```

Output:

```txt
#0 :  [ 'a', 'b', 'c' ]
#1 :  [ 'd', 'e', 'f' ]
```

### read(input: string, sep: string, quo: string, callback: function): number

### read(input: string, sep: string, callback: function): number

### read(input: string, callback: function): number

_callback(row: array): void_

Calls `callback` when a CSV row is read. The Array passed to callback contains the fields of the row.
Returns the first offset after the row.

```js
import * as CSV from 'csv-string';

const data = 'a,b,c\nd,e,f';

const index = CSV.read(data, ',', row => {
  console.log(row);
});

console.log(data.slice(index));
```

Output:

```txt
[ 'a', 'b', 'c' ]
d,e,f
```

### readAll(input: string, sep: string, quo: string, callback: function): number

### readAll(input: string, sep: string, callback: function): number

### readAll(input: string, callback: function): number

_callback(rows: array): void_

Calls `callback` when all CSV rows are read. The Array passed to callback contains the rows of the file.
Returns the offset of the end of parsing (generally it's the end of the input string).

```js
import * as CSV from 'csv-string';

const data = 'a,b,c\nd,e,f';

const index = CSV.readAll(data, row => {
  console.log(row);
});

console.log('-' + data.slice(index) + '-');
```

Output:

```txt
[ [ 'a', 'b', 'c' ], [ 'd', 'e', 'f' ] ]
--
```

### readChunk(input: string, sep: string, quo: string, callback: function): number

### readChunk(input: string, sep: string, callback: function): number

### readChunk(input: string, callback: function): number

_callback(rows: array): void_

Calls `callback` when all CSV rows are read. The last row could be ignored, because the remainder could be in another chunk.
The Array passed to callback contains the rows of the file.
Returns the offset of the end of parsing. If the last row is ignored, the offset will point to the beginnning of the row.

```js
import * as CSV from 'csv-string';

const data = 'a,b,c\nd,e';

const index = CSV.readChunk(data, row => {
  console.log(row);
});

console.log('-' + data.slice(index) + '-');
```

Output:

```txt
[ [ 'a', 'b', 'c' ] ]
--
```

### createStream(options: Object): WritableStream

### createStream(): WritableStream

Create a writable stream for CSV chunk. Options are :

- **separator** : To indicate the CSV separator. By default is auto (see the detect function)
- quote\*\* : To indicate the CSVquote.

Example : Read CSV file from the standard input.

```js
const stream = CSV.createStream();

stream.on('data', row => {
  console.log(row);
});

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.pipe(stream);
```

## Contribution

- `clone`
- `yarn install`
- ... do the changes, write tests
- `yarn test` (ensure all tests pass)
- `yarn bench` (to check the performance impact)

## Related projects

- <https://npmjs.org/browse/keyword/csv>
- <http://www.uselesscode.org/js/csv/>
- <https://github.com/archan937/csonv.js>

## Benchmark

There is a quite basic benchmark to compare this project to other related ones, using file streams as input. See `./bench` for source code.

### the test

```bash
yarn bench
```

### the result

for a test file with 949,044 rows

| Package        | Time      | Output/Input similarity |
| -------------- | --------- | ----------------------- |
| a-csv          | 6.01s     | ~99%                    |
| csv-stream     | 6.64s     | ~73%                    |
| csv-streamer   | 7.03s     | ~79%                    |
| **csv-string** | **6.53s** | **100%**                |
| fast-csv       | 12.33s    | 99.99%                  |
| nodecsv        | 7.10s     | 100%                    |

## License

[MIT/X11](https://github.com/Inist-CNRS/node-csv-string/blob/master/LICENSE)
