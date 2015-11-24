var React = require('react');
var App = require('../ui/gt-app.jsx');

window.onload = function() {
   var canvas = document.getElementById('canvas');
   var gl = canvas.getContext('webgl', {
      preserveDrawingBuffer: true
   });
   React.render(<App glContext={gl} />, document.getElementById('react-thing'));
}
