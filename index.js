var express    = require('express');
var app        = express();
var vm         = require('vm');
var browserify = require('browserify');
var util       = require('util');

// configure expressjs
app.configure(function () {
  app.use(express.bodyParser());
  app.use('/static', express.static(__dirname + '/public'));
  app.set('title', 'Online JS Runner');
  app.set('views', __dirname + '/view');
  app.set('view engine', 'jade');
  app.engine('jade', require('jade').__express);
});

// bundle clientside js
var clientjssrc = '';
var b = browserify();
b.add(__dirname + '/clientjs/index.js');
b.bundle(function (err, src) {
	clientjssrc = src;
});

// the little VM runner
function runInNewVM (jsStr) {
  try {
    var sandbox = {};
    vm.runInNewContext(jsStr, sandbox);
    // console.dir(sandbox);
    return util.inspect(sandbox);
  } catch (error) {
    // console.log(error);
    return util.inspect(error);
  }
}

// index (main) route /
app.get('/', function (req, res) {
  var jsid = '', i;
  for (i = 0; i < 8; i++) {
    jsid += Math.floor(Math.random() * 16).toString(16);
  }
  // this is a first approach for the realtime communication
  // jsid is used to identify a "js file/room/hangout"
  res.redirect('/js/'+jsid);
});

app.get('/js/:jsid', function (req, res) {
  res.render('main', {
    js: clientjssrc
  });
});

// receiving the JavaScript
app.put('/putJS', function (req, res) {
  var s = '';
  req.on('data', function (buf) { s += buf.toString(); });
  req.on('end', function () {
    res.set('content-type', 'application/json');
    res.send(JSON.stringify(runInNewVM(s), null, 4))
  })
});

// fireup http server
app.listen(process.env.PORT || 80);
console.log('OnlineJSRunner listens on port: %d', process.env.PORT || 80);