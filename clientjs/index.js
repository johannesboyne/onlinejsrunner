var http = require('http');

var options = {
  hostname: window.location.host,
  port: window.location.port,
  path: '/putJS',
  method: 'put'
};

function _runJS () {
  var req = http.request(options, function (res) {
    var s = '';
    res.on('data', function (chunk) {
      s += chunk.toString();
    });
    res.on('end', function () {
      // console.log('BODY: ');
      // console.log(JSON.parse(s));
      var oldJs = window.e.getSession().getValue();
      var newJs = oldJs + '\n\n// OUTPUT\n//------\n/*' + JSON.parse(s).toString() + '*/';
      e.getSession().setValue(newJs);
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  var jsStr = window.e.getSession().getValue();
  req.write(jsStr);
  req.end();
}

window.onload = function () { document.getElementById('btn').addEventListener('click', _runJS); };