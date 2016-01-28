/// <reference path="../typings/tsd.d.ts" />

import App = require('./app');

window.onload = function() {
    var canvas = document.getElementById('canvas') as HTMLCanvasElement;
    var gl = canvas.getContext('webgl', {
        preserveDrawingBuffer: true
    }) as WebGLRenderingContext;

    App(gl, document.getElementById('glsl-thing'));
}
