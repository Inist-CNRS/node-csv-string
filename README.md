
# Javascript CSV Strings

[![Build Status](https://secure.travis-ci.org/touv/node-csv-string.png?branch=master)](http://travis-ci.org/touv/node-csv-string)

It's a collection of javascript tools for strings conatins any kind of CSV. It tries to be tolerant. 
It can be used in a browser or with nodejs.

## Contributors

  * [Nicolas Thouvenin](https://github.com/touv) 

# Installation

With [npm](http://npmjs.org) do:

    $ # Coming soon


# Examples

	
# Tests

Use [mocha](https://github.com/visionmedia/mocha) to run the tests.

    $ npm install mocha
    $ mocha test

# API Documentation

## parse(input : String, [separtor : String]) : Object

Parse an string that contains CSV.
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

Detect the best separator.

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
	



# Also

* https://npmjs.org/browse/keyword/csv
* http://www.uselesscode.org/javascript/csv/
* https://github.com/archan937/csonv.js

# License

[MIT/X11](https://github.com/touv/node-csv-string/blob/master/LICENSE)
