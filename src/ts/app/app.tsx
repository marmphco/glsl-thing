/// <reference path="../typings/tsd.d.ts" />

import React = require('react');
import ReactDOM = require('react-dom');
import GLSLApp = require('../lib/gt-app');

window.onload = function() {
    var canvas = document.getElementById('canvas') as HTMLCanvasElement;
    var gl = canvas.getContext('webgl', {
        preserveDrawingBuffer: true
    }) as WebGLRenderingContext;

    ReactDOM.render(<GLSLApp glContext={gl} />, document.getElementById('react-thing'));
}
