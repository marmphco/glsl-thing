var React = require('react');
/*var AceEditor = require('react-ace');
var Workspace = require('../ui/gt-workspace.jsx');
var NodeTypes = require('../lib/gt-node-types.js');
var PortTypes = require('../lib/gt-port.js').PortType;

require('brace/mode/glsl');
require('brace/theme/solarized_dark');*/
var App = require('../ui/gt-app.jsx');

window.onload = function() {

   var canvas = document.getElementById('canvas');
   var gl = canvas.getContext('webgl', {
      preserveDrawingBuffer: true
   });
   React.render(<App glContext={gl} />, document.getElementById('react-thing'));
/*
   var nodes = [];
   var bindings = [];

   var addNode = function(node) {
      nodes.push(node);
      return nodes.length - 1;
   }

   var addBinding = function(inputNode, inputPort, outputNode, outputPort) {
      nodes[inputNode].inputPort(inputPort).bindTo(nodes[outputNode].outputPort(outputPort));
      bindings.push({
         input: {id: inputNode, port: inputPort},
         output: {id: outputNode, port: outputPort}
      })
   }

   // setup context
   var canvas = document.getElementById('canvas');
   var context = new GLSLThing.Context(canvas);
   var gl = context.gl;

   // get shader source
   var vertexSource = document.getElementById('test-vertex-shader').firstChild.textContent;
   var fragmentSource = document.getElementById('test-fragment-shader').firstChild.textContent;

   // create shader source nodes
   var vshSourceNode = new GLSLThing.ValueNode(GLSLThing.Port.PortType.String);
   var fshSourceNode = new GLSLThing.ValueNode(GLSLThing.Port.PortType.String);
   var vshSourceNodeID = addNode(vshSourceNode);
   var fshSourceNodeID = addNode(fshSourceNode);
   // set the shader node inputs
   vshSourceNode.setValue(vertexSource);
   fshSourceNode.setValue(fragmentSource);

   // create shader nodes
   var vshNode = new GLSLThing.ShaderNode(gl, gl.VERTEX_SHADER);
   var fshNode = new GLSLThing.ShaderNode(gl, gl.FRAGMENT_SHADER);
   var vshNodeID = addNode(vshNode);
   var fshNodeID = addNode(fshNode);
   // bind shader nodes to source nodes
   addBinding(vshNodeID, 'source', vshSourceNodeID, 'value');
   addBinding(fshNodeID, 'source', fshSourceNodeID, 'value');

   // create program node
   var programNode = new GLSLThing.ProgramNode(gl);
   var programNodeID = addNode(programNode);
   // bind shader nodes to inputs of program node
   addBinding(programNodeID, 'vertexShader', vshNodeID, 'shader');
   addBinding(programNodeID, 'fragmentShader', fshNodeID, 'shader');

   // create mesh for a square
   var vertices = new Float32Array([
      -1.0, -1.0, 0.0,
      1.0, -1.0, 0.0,
      -1.0, 1.0, 0.0,
      1.0, 1.0, 0.0
   ]);
   var indices = new Uint16Array([0, 1, 2, 3]);
   // create mesh node with square mesh
   var meshNode = new GLSLThing.MeshNode(gl, vertices, indices, gl.TRIANGLE_STRIP);
   var meshNodeID = addNode(meshNode);

   // create render node
   var renderNode = new GLSLThing.RenderNode(gl);
   var renderNodeID = addNode(renderNode);
   // bind render node inputs to mesh and program
   addBinding(renderNodeID, 'mesh', meshNodeID, 'mesh');
   addBinding(renderNodeID, 'program', programNodeID, 'program');

   setTimeout(function() {
      console.log('IMAGE LOADED');
      var imageNode = new GLSLThing.ImageNode(gl);
      var imageNodeID = addNode(imageNode);
      addBinding(renderNodeID, 'texture0', imageNodeID, 'texture');
      imageNode.setImageData(document.getElementById('pusheen'));

      var testNode = new GLSLThing.ValueNode(gl.FLOAT);
      var testNodeID = addNode(testNode);
      addBinding(renderNodeID, 'test', testNodeID, 'value');
      testNode.setValue(0.5);

      setTimeout(() => {
         //var image = new Image();
         console.log('dfadfsadfs');
         document.getElementById('output').src = GLSLThing.dataURLWithTexture(gl, renderNode.outputPort('renderedImage').value());
        // document.body.appendChild(image);
      }, 0);

      var selectedNode;

      var handleNodeSelected = (node) => {
         if (node.type() == NodeTypes.ValueNode) {
            if (node.outputPort('value').type() == PortTypes.String) {
               render(node.outputPort('value').value());
               selectedNode = node;
            }
         }
      };

      var handleNodeDeselected = (node) => {
         selectedNode = null;
         render('');
      };

      var handleEditorChanged = (newValue) => {
         if (selectedNode) {
            selectedNode.setValue(newValue);
            setTimeout(() => {
               //var image = new Image();
               console.log('dfadfsadfs');
               document.getElementById('output').src = GLSLThing.dataURLWithTexture(gl, renderNode.outputPort('renderedImage').value());
              // document.body.appendChild(image);
            }, 500); // artificial delay
         }
      };

      var render = function(editorValue) {
         React.render(
            <div>
               <div className='gt-workspace'>
                  <Workspace nodes={nodes}
                             bindings={bindings} 
                             onNodeSelected={handleNodeSelected}
                             onNodeDeselected={handleNodeDeselected}/>
               </div>
               <div className='gt-shader-editor'>
                  <AceEditor mode='glsl'
                             theme='solarized_dark'
                             name='code-editor' 
                             width='100%'
                             height='100%' 
                             value={editorValue}
                             onChange={handleEditorChanged} />
               </div>
            </div>,
            document.getElementById('react-thing')
         );
      }
      render();

   }, 0);*/
}
