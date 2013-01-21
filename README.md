# Javascript CSV Strings

[![Build Status](https://secure.travis-ci.org/touv/node-csv-string.png?branch=master)](http://travis-ci.org/touv/node-csv-string)

It's a collection of javascript tools (parse/stringify) for CSV strings. 
Unlike many other similar modules, it works correctly with fields containing newlines (including on the first line)
 
## Contributors

  * [Nicolas Thouvenin](https://github.com/touv) 

# Installation

With [npm](http://npmjs.org) do:

    $ npm install cvs-string


# Examples

	
# Tests

Use [mocha](https://github.com/visionmedia/mocha) to run the tests.

    $ npm install mocha
    $ mocha test

# API Documentation

## parse(input : String, [separtor : String]) : Object

Parse `input` to convert to an array.
```javascript
	var CSV = require('csv-string'),
	 arr = CSV.parse('a,b,c\na,b,c');

	console.log(arr);
```
Output:
	
	[ [ 'a', 'b', 'c' ], [ 'a', 'b', 'c' ] ]
	
	
## stringify(input : Object, [separtor : String]) : String

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
	



# Also

* https://npmjs.org/browse/keyword/csv
* http://www.uselesscode.org/javascript/csv/
* https://github.com/archan937/csonv.js

# License

[MIT/X11](https://github.com/touv/node-csv-string/blob/master/LICENSE)
