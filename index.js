var express = require('express');
var app = express();
var vm = require('vm');
var browserify = require('browserify');
var sandbox = {};

app.configure(function(){
  app.set('title', 'Online JS Runner');
  app.set('views', __dirname + '/view');
  app.set('view engine', 'jade');
  app.engine('jade', require('jade').__express);
});

var clientjssrc = '';
var b = browserify();
b.add(__dirname + '/clientjs/index.js');
b.bundle(function (err, src) {
	// console.log(src);
	clientjssrc = src;
});

try {
  vm.runInNewContext('function Base () {}; var b = new Base();', sandbox);
  console.dir(sandbox);
} catch (error) {
  console.log(error);
}


app.get('/', function(req, res){
  res.render('main', {
  	js: clientjssrc
  });
});

app.listen(3000);