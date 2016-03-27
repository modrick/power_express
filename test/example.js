'use strict'
var fs = require('fs');
var express = require('express');
express = require('../')(express);
var app = express();

var readFile = function(fileName) {
	return new Promise(function(resolve, reject) {
		fs.readFile(fileName, function(error, data) {
			if (error) reject(error);
			resolve(data);
		});
	});
};

app.addErrorHandle(function(err, req, res) {
	res.json({
		code: 500,
		data: err.toString()
	})
})

app.get('/', function*(req, res) {
	var result = yield readFile(__dirname + '/example.js')
	return res.send(String(result))
})

app.listen(3000);

