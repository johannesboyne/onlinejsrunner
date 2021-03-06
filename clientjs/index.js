var http = require('http');

var optionsRun = {
  hostname: window.location.host,
  port: window.location.port,
  path: '/putJS',
  method: 'put'
};

var optionsSave = {
  hostname: window.location.host,
  port: window.location.port,
  path: '/saveJS',
  method: 'put'
};

// Send JS to the Node.js instance and let it run
function runJS () {
  document.getElementById('background').style.fill = '#ff0000';
  var req = http.request(optionsRun, function (res) {
    var s = '';
    res.on('data', function (chunk) {
      s += chunk.toString();
    });
    res.on('end', function () {
      var oldJs = window.e.getSession().getValue();
      var t_new = '\n\n// [OUTPUT]\n// --------\n/*' + JSON.parse(s).toString() + '*/';
      var newJs = oldJs + t_new;
      console.log(t_new);
      e.getSession().setValue(newJs);
      aceEditorJumpDown();
      document.getElementById('background').style.fill = '#F7DF1E';
    });
  });

  req.on('error', function(e) {
    alert('problem with request: ' + e.message);
  });

  var jsStr = window.e.getSession().getValue();
  req.write(jsStr);
  req.end();
}

// Save JS 
function saveJS () {
  document.getElementById('save').style.fill = '#ff0000';
  var req = http.request(optionsSave, function (res) {
    res.on('end', function () {
      aceEditorJumpDown();
      document.getElementById('save').style.fill = '#F7DF1E';
    });
  });

  req.on('error', function(e) {
    alert('problem with request: ' + e.message);
  });

  var saveObj = {
    id: window.location.pathname.split('/').join(':').substr(1),
    js: window.e.getSession().getValue()
  };
  req.write(JSON.stringify(saveObj));
  req.end();
}

// check keydown user interaction
function onKeyDown (e) {
  if ((e.ctrlKey || e.metaKey) && e.keyCode === 190) {
    e.preventDefault(); e.stopPropagation();
    runJS();
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 48) {
    e.preventDefault(); e.stopPropagation();
    window.e.getSession().setValue(removeOwnComments(window.e.getSession().getValue()));
  }
}

// tell ace to jump down
function aceEditorJumpDown () {
  window.e.focus();
  var n = window.e.getSession().getValue().split("\n").length; // To count total no. of lines
  window.e.gotoLine(n);
}

// remove own comments:
// //:: comment
function removeOwnComments (str) {
  return str.replace(/\/\/::.*\n/g, '');
}

// Show support comments
function showSupport () {
  var oldJs = removeOwnComments(e.getSession().getValue());
  var supportStr = ''
    + '//:: Online JS Runner\n'
    + '//:: ----------------\n'
    + '//::                 \n'
    + '//:: This little software is purely open-source, feel free to collaborate!\n'
    + '//:: github link: goo.gl/6voI3                   \n'
    + '//::                                             \n'
    + '//:: Keyboard Commands:                          \n'
    + '//:: - OSX: cmd  + . (run the JS)                \n'
    + '//:: - Win: ctrl + .                             \n'
    + '//:: - OSX: cmd  + 0 (clear this comments away)  \n'
    + '//:: - Win: ctrl + 0                             \n'
    + '//:: \n'
    + '//:: Technology                                  \n'
    + '//:: ----------                                  \n'
    + '//:: - Node.js (hosted by nodejitsu.com)         \n'
    + '//:: - Ace Editor (ace.ajax.org)                 \n'
    + '//:: \n'
    + '//:: Future Steps                                \n'
    + '//:: ----------                                  \n'
    + '//:: 1.) realtime, collaborational editing       \n'
    + '//:: 2.) save and share javascripts              \n'
    + '//:: 3.) ??? \n'
    + '//:: ---------------------------------------------------------------------------\n';
  var newJs = supportStr + oldJs;
  e.getSession().setValue(newJs);
}

// on window load, show welcome message + JS
window.onload = function () {
  var welcomeStr = ''
    + '//:: Hi, this is your JavaScript Playground.                        \\   \\        \n'
    + '//:: Here you can run & test vanilla JS!                             \\ f \\       \n'
    + '//::                                                                  \\ o \\      \n'
    + '//:: Just type in your JS code and click on                            \\ r \\     \n'
    + '//:: the left [JS] Button to push it to our      (github:)              \\ k \\    \n'
    + '//:: running Node.js instance. It will run       (goo.gl/6voI3)          \\ m \\   \n'
    + '//:: your code inside of a VM (Sandboxed)                                 \\ e \\  \n'
    + '//::                                                                       \\   \\ \n'
    + '//:: <= give it a try and press [JS] or do cmd + . (ctrl + .)                      \n'
    + '//:: © '+new Date().getFullYear()+' Johannes Boyne; github.com/johannesboyne;      \n'
    + '//:: ---------------------------------------------------------------------------\n'
    + '//:: \n'
    + '//::                               MMMMMMM+         /ymMMMMMMMMMms:\n'
    + '//::                               MMMMMMM+       +NMMMMMMMMMMMMMMMd:\n'
    + '//::                               MMMMMMM+      sMMMMMMMMNNNMMMMMMMN:\n'
    + '//::                               MMMMMMM+     :MMMMMMMo`   .oNMNy/`\n'
    + '//::                               MMMMMMM+     oMMMMMMd       .:\n'
    + '//::                               MMMMMMM+     /MMMMMMMo`\n'
    + '//::                               MMMMMMM+      dMMMMMMMMho:`\n'
    + '//::                               MMMMMMM+      `hMMMMMMMMMMMmy/.\n'
    + '//::                               MMMMMMM+        :hMMMMMMMMMMMMMmo`\n'
    + '//::                               MMMMMMM+          `/ymMMMMMMMMMMMMs`\n'
    + '//::                               MMMMMMM+              `:ohNMMMMMMMMd`\n'
    + '//::                               MMMMMMM+                   :yMMMMMMMs\n'
    + '//::                      .        MMMMMMM/       `//           yMMMMMMd\n'
    + '//::                  `/yNM+      :MMMMMMM-    .+dMMMh-        `dMMMMMMh\n'
    + '//::                -dMMMMMMmo//+yMMMMMMMd    :MMMMMMMMmy+///oyNMMMMMMM:\n'
    + '//::                 oMMMMMMMMMMMMMMMMMMm.     .hMMMMMMMMMMMMMMMMMMMMN/\n'
    + '//::                  .sNMMMMMMMMMMMMMNo`        -sNMMMMMMMMMMMMMMMNo`\n'
    + '//::                     :oydmNNNmdyo-              ./shdmNNNmdhs+-\n'
    + '\n';
  if (window.savedJs.length === 0) {
    welcomeStr +=  ''
    + 'function sayHelloWorld (array) {\n'
    + '    return array.join(\', \');\n'
    + '}\n\n'
    + 'var helloworld = [\'world\', \'welt\', \'mundo\', \'världen\'];\n'
    + 'var out   = sayHelloWorld(helloworld);\n';
  } else {
    welcomeStr += window.savedJs;
  }
  
  e.getSession().setValue(welcomeStr);
  
  // addEventListeners

  var clickType = 'click';
  if ('ontouchstart' in document.documentElement)
    clickType = 'touchend';

  document.getElementById('btn').addEventListener(clickType, runJS);
  document.getElementById('btn').addEventListener(clickType, runJS);
  document.getElementById('support').addEventListener(clickType, showSupport);
  // document.getElementById('save').addEventListener(clickType, saveJS);
  window.addEventListener('keydown', onKeyDown);
};
