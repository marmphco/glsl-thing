/// <reference path="../typings/tsd.d.ts" />

import React = require('react');
import ReactDOM = require('react-dom');
import App = require('./app');

window.onload = function() {
    var canvas = document.getElementById('canvas') as HTMLCanvasElement;
    var gl = canvas.getContext('webgl', {
        preserveDrawingBuffer: true
    }) as WebGLRenderingContext;

    ReactDOM.render(<App glContext={gl} />, document.getElementById('react-thing'));
}
