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
      var newJs = oldJs + '\n\n// OUTPUT\n// ------\n/*' + JSON.parse(s).toString() + '*/';
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

window.onload = function () {
  var welcomeStr = ''
    + '// Hi, this is your JavaScript Playground.                          \\   \\ \n'
    + '// Here you can run & test vanilla JS!                               \\ f \\ \n'
    + '//                                                                    \\ o \\ \n'
    + '// Just type in your JS code and click on                              \\ r \\ \n'
    + '// the left [JS] Button to push it to our        (github)               \\ k \\ \n'
    + '// running Node.js instance. It will run         (comming soon to gh)    \\ m \\ \n'
    + '// your code insight a VM (Sandboxed)                                     \\ e \\ \n'
    + '// <= give it a try!                                                       \\   \\ \n'
    + '// -----------------------------------------------------------------------------\n'
    + '//                                 ````````            `.::::-.\n'
    + '//                               MMMMMMM+         /ymMMMMMMMMMms:\n'
    + '//                               MMMMMMM+       +NMMMMMMMMMMMMMMMd:\n'
    + '//                               MMMMMMM+      sMMMMMMMMNNNMMMMMMMN:\n'
    + '//                               MMMMMMM+     :MMMMMMMo`   .oNMNy/`\n'
    + '//                               MMMMMMM+     oMMMMMMd       .:\n'
    + '//                               MMMMMMM+     /MMMMMMMo`\n'
    + '//                               MMMMMMM+      dMMMMMMMMho:`\n'
    + '//                               MMMMMMM+      `hMMMMMMMMMMMmy/.\n'
    + '//                               MMMMMMM+        :hMMMMMMMMMMMMMmo`\n'
    + '//                               MMMMMMM+          `/ymMMMMMMMMMMMMs`\n'
    + '//                               MMMMMMM+              `:ohNMMMMMMMMd`\n'
    + '//                               MMMMMMM+                   :yMMMMMMMs\n'
    + '//                      .        MMMMMMM/       `//           yMMMMMMd\n'
    + '//                  `/yNM+      :MMMMMMM-    .+dMMMh-        `dMMMMMMh\n'
    + '//                -dMMMMMMmo//+yMMMMMMMd    :MMMMMMMMmy+///oyNMMMMMMM:\n'
    + '//                 oMMMMMMMMMMMMMMMMMMm.     .hMMMMMMMMMMMMMMMMMMMMN/\n'
    + '//                  .sNMMMMMMMMMMMMMNo`        -sNMMMMMMMMMMMMMMMNo`\n'
    + '//                     :oydmNNNmdyo-              ./shdmNNNmdhs+-\n'
    + '\n'
    + 'var hallo = \'welt\';';
  e.getSession().setValue(welcomeStr);
  document.getElementById('btn').addEventListener('click', _runJS);
  document.getElementById('btn').addEventListener('touchend', _runJS);
};