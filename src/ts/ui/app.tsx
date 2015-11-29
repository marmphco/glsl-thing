/// <reference path="../typings/tsd.d.ts" />

import React = require('react');
import ReactBootstrap = require('react-bootstrap');

const ButtonToolbar = ReactBootstrap.ButtonToolbar;
const DropdownButton = ReactBootstrap.DropdownButton;
const MenuItem = ReactBootstrap.MenuItem;
const Button = ReactBootstrap.Button;

interface Properties {
    glContext: WebGLRenderingContext;
}

interface State {
    selectedNodeID: number;
    viewerImageData: string;
}

export = class App extends React.Component<Properties, State> {

    constructor(props: Properties) {
        super(props);

        this.state = {
            selectedNodeID: 0,
            viewerImageData: null
        }
    }

    handleAddNode() {

    }

    handleRemoveNode() {

    }

    commitSourceEdits() {

    }

    serializeNodeGraph() {

    }

    render() {
        return (
            <div>
                <ButtonToolbar>
                    <DropdownButton title="Add Node" onSelect={this.handleAddNode}>
                    </DropdownButton>
                    <Button onClick={this.handleRemoveNode}
                            disabled={!this.state.selectedNodeID}>
                        Remove
                    </Button>
                    <Button onClick={this.commitSourceEdits}
                            disabled={!this.state.selectedNodeID}>
                        Commit Source Edits
                    </Button>
                    <Button onClick={this.serializeNodeGraph}>
                        Save
                    </Button>
                </ButtonToolbar>
                <div className='gt-workspace'>

                </div>
                <img className='gt-viewer'
                     alt='Render Viewer?'
                     src={this.state.viewerImageData} />
                <div className='gt-shader-editor'>
                </div>
            </div>
        );
    }
}
