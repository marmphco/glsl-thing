/// <reference path="../typings/tsd.d.ts" />

import React = require('react');

interface Properties {
    glContext: WebGLRenderingContext;
}

export = class App extends React.Component<Properties, {}> {
    render() {
        return (<div>{this.props.glContext.toString()}</div>);
    }
}
