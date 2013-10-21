# Javascript CSV Strings

[![Build Status](https://travis-ci.org/touv/node-csv-string.png?branch=master)](https://travis-ci.org/touv/node-csv-string)

Parse and Stringify for CSV strings. It's like JSON object but for CSV. It can also work row by row. 
And, if can parse strings, it can be use to parse files or streams too.
 
## Contributors

  * [Nicolas Thouvenin](https://github.com/touv) 
  * [Stéphane Gully](https://github/kerphi)
  * [J. Baumbach](https://github.com/jbaumbach)
  * [Sam Hauglustaine](https://github.com/smhg)
  * [Rick Huizinga](https://github.com/rickhuizinga)

# Installation

With [npm](http://npmjs.org) do:

    $ npm install csv-string


# Tests

Use [mocha](https://github.com/visionmedia/mocha) to run the tests.

    $ npm install mocha
    $ mocha test

# API Documentation

## parse(input : String, [separator : String]) : Object

Parse `input` to convert to an array.
```javascript
	var CSV = require('csv-string'),
	 arr = CSV.parse('a,b,c\na,b,c');

	console.log(arr);
```
Output:
	
	[ [ 'a', 'b', 'c' ], [ 'a', 'b', 'c' ] ]
	
If separator parameter is not provided, it is automatically detected.

## stringify(input : Object, [separator : String]) : String

Converts `input` to a CSV string. 

```javascript
	var CSV = require('csv-string');
	
	console.log(CSV.stringify(['a', 'b', 'c']));
	console.log(CSV.stringify([['c', 'd', 'e'], ['c','d','e']]));
	console.log(CSV.stringify({a:'e', b:'f', c:'g'}));
```
Output:
	
	a,b,c
	
	c,d,e
	c,d,e
	
	e,f,g

## detect(input : String) : String

Detects the best separator.

```javascript
	var CSV = require('csv-string');
	
	console.log(CSV.detect('a,b,c'));
	console.log(CSV.detect('a;b;c'));
	console.log(CSV.detect('a|b|c'));
	console.log(CSV.detect('a\tb\tc'));
```
Output:
	
	,
	;
	|
	\t
	

## forEach(input : String, sep : String, callback : Function) 
## forEach(input : String, callback : Function) 
_callback(row : Array, index : Number) : undefined_

Calls `callback` for each CSV row/line. The Array passed to callback contains the fields of the current row.  


```javascript
	var CSV = require('csv-string');
    var data = 'a,b,c\nd,e,f';
	CSV.forEach(data, ',', function(row, index) {
		console.log('#' + index + ' : ', row);
	});
```
Output:
	
	#0 :  [ 'a', 'b', 'c' ]
	#1 :  [ 'd', 'e', 'f' ]
	

## read(input : String, sep : String, callback : Function) : Number
## read(input : String, callback : Function) : Number
_callback(row : Array) : undefined_ 

Calls `callback` when a CSV row is readed. The Array passed to callback contains the fields of the row.  
Returns the first offset after the row.


```javascript
	var CSV = require('csv-string');
    var data = 'a,b,c\nd,e,f';
	var index = CSV.read(data, ',', function(row) {
		console.log(row);
	});
    console.log(data.slice(index));
```
Output:
	
	[ 'a', 'b', 'c' ]
	d,e,f
	

## readAll(input : String, sep : String, callback : Function) : Number
## readAll(input : String, callback : Function) : Number
_callback(rows : Array) : undefined_

Calls `callback` when a all CSV rows is readed. The Array passed to callback contains the rows of the file.  
Returns the offset of the end of parsing (generaly it's the end of the input string).


```javascript
	var CSV = require('csv-string');
    var data = 'a,b,c\nd,e,f';
	index = CSV.readAll(data, function(row) {
		console.log(row);
	});
    console.log('-' + data.slice(index) + '-');
```
Output:
	
	[ [ 'a', 'b', 'c' ], [ 'd', 'e', 'f' ] ]
	--
## readChunk(input : String, sep : String, callback : Function) : Number
## readChunk(input : String, callback : Function) : Number
_callback(rows : Array) : undefined_

Calls `callback` when a all CSV rows is readed. The last row could be ignored, because the remainder could be in another chunk. 
The Array passed to callback contains the rows of the file. 
Returns the offset of the end of parsing. When the last row is ignored, the offset point at the begin of row.


```javascript
	var CSV = require('csv-string');
    var data = 'a,b,c\nd,e';
	index = CSV.readChunk(data, function(row) {
		console.log(row);
	});
    console.log('-' + data.slice(index) + '-');
```
Output:
	
	[ [ 'a', 'b', 'c' ] ]
	--
	
	
## createStream(options : Array) : WritableStream
## createStream() : WritableStream

Create a writable stream for CSV chunk. Options are :

* **separator** : To indicate the CSV separator. By default is comma (',')

Example : Read CSV file from the standard input.

```javascript
	var stream = CSV.createStream();
	
	stream.on('data', function (row) {
	     console.log(row);
	  }
	)
	
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	process.stdin.pipe(stream);
```




# Also

* https://npmjs.org/browse/keyword/csv
* http://www.uselesscode.org/javascript/csv/
* https://github.com/archan937/csonv.js

# Benchmark

 
A for file and stream, there are many others packages that already exists. 
To compare them, I made a very basic benchmark (see ./bench for source code)

## the test

```bash

	time node ./SCRITPNAME.js >/dev/null

```
## the result

<table>
<thead> 
<tr>
<th>Package</th>
<th>Input equal Output</th>
<th>Time for ~1 200 000 rows</th>
</tr>
<tbody>
<tr>
<td>a-csv</td>        <td>almost</td>	<td>0m13.903s</td>
</tr> <tr>
<td>csv-streamer</td> <td>yes</td>	<td>0m15.599s</td>
</tr> <tr>
<td>csv-stream</td>   <td>yes</td>	<td>0m17.265s</td>
</tr> <tr>
<th>csv-string</th>   <th>yes</th>	<th>0m15.432s</th>
</tr> <tr>
<td>fast-csv</td>     <td>no</td>	<td>-</td>
</tr> <tr>
<td>nodecsv</td>      <td>yes</td>	<td>0m22.129s</td>
</tr>
</tbody>
</table>

# License

[MIT/X11](https://github.com/touv/node-csv-string/blob/master/LICENSE)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/touv/node-csv-string/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

