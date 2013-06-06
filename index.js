var express    = require('express');
var app        = express();
var vm         = require('vm');
var browserify = require('browserify');
var util       = require('util');

app.configure(function () {
  app.use(express.bodyParser());
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

function _runInNewVM (jsStr) {
  try {
    var sandbox = {};
    vm.runInNewContext(jsStr, sandbox);
    console.dir(sandbox);
    return util.inspect(sandbox);
  } catch (error) {
    console.log(error);
    return util.inspect(error);
  }
}


app.get('/', function (req, res){
  res.render('main', {
  	js: clientjssrc
  });
});

app.put('/putJS', function (req, res) {
  var s = '';
  req.on('data', function (buf) { s += buf.toString(); });
  req.on('end', function () {
    console.log(s);
    // res.send(_runInNewVM(s));
    res.set('content-type', 'application/json');
    res.send(JSON.stringify(_runInNewVM(s), null, 4))
  })
});

app.listen(3000);