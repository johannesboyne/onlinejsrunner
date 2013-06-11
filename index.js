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

// bundle clientside js (browserify)
var clientjssrc = '';
var b = browserify();
b.add(__dirname + '/clientjs/index.js');
b.bundle(function (err, src) {
	clientjssrc = src;
});

// the little JS VM runner
// it is highly simple but still powerfull
function runInNewVM (jsStr) {
  try {
    var sandbox = {};
    vm.runInNewContext(jsStr, sandbox);
    return util.inspect(sandbox);
  } catch (error) {
    return util.inspect(error);
  }
}

// HTTP GET /
function getMain (req, res) {
  var jsid = '', i;
  for (i = 0; i < 8; i++) {
    jsid += Math.floor(Math.random() * 16).toString(16);
  }
  // this is a first approach for the realtime communication and saving step
  // jsid is used to identify a "js file/room/hangout"
  res.redirect('/js/'+jsid);
}

// @TODO: 
// Enable realtime communication and temporary saving.
// HTTP GET /js/:id
function getJS (req, res) {
  res.render('main', {
    title: app.get('title'),
    clientJs: clientjssrc,
    savedJs: '' // @STATUS: DEACTIVATED
  });
}

// HTTP PUT /putJS
function putJSforRunning (req, res) {
  var s = '';
  req.on('data', function (buf) { s += buf.toString(); });
  req.on('end', function () {
    res.set('content-type', 'application/json');
    res.send(JSON.stringify(runInNewVM(s), null, 4))
  });
}

// @TODO:
// Replace JS-String hyphens etc. to push it back to the browser without hassl!
// @STATUS: DEACTIVATED
// HTTP PUT /saveJS
function putJSforSave (req, res) {
  var s = '';
  req.on('data', function (buf) { s += buf.toString(); });
  req.on('end', function () {
    res.set('content-type', 'application/json');
    var saveObj = JSON.parse(s);
    console.log('save: %s %s', saveObj.id, String(saveObj.js));
    res.send(JSON.stringify({ err: null, success: true }));
  });
}

// serving
app.get('/', getMain);
app.get('/js/:jsid', getJS);

// receiving the JavaScript
app.put('/putJS', putJSforRunning);
// app.put('/saveJS', putJSforSave); // @STATUS: DEACTIVATED

// fireup http server
app.listen(process.env.PORT || 80);
console.log('OnlineJSRunner listens on port: %d', process.env.PORT || 80);