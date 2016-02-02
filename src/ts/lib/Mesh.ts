import {Table} from './Table'

export interface MeshAttributes {
    key: string;
    dimension: number;
    stride: number;
    offset: number;
}

export interface MeshAttributeBinder {
    (attributeLoc: number): void;
}

export class Mesh {

    private _gl: WebGLRenderingContext;
    private _drawMode: number;
    private _elementCount: number;
    private _elementArrayName: string;
    private _attributes: Table<MeshAttributes>;
    private _buffers: Table<WebGLBuffer>;

    constructor(gl: WebGLRenderingContext,
                drawMode: number,
                elementArrayName: string,
                arrays: Table<number[]>,
                attributes: Table<MeshAttributes>) {

        this._gl = gl;
        this._drawMode = drawMode;
        this._elementCount = arrays[elementArrayName].length;
        this._elementArrayName = elementArrayName;
        this._attributes = attributes;
        this._buffers = {};

        // Setup attribute buffers
        for (const attributeName in attributes) {
            if (attributeName != elementArrayName) {
                const attribute = attributes[attributeName];
                const attributeData = new Float32Array(arrays[attributeName]);

                const buffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ARRAY_BUFFER, attributeData, gl.STATIC_DRAW);

                this._buffers[attributeName] = buffer;
            }
        }

        // Setup element array buffer
        const elementArray = arrays[elementArrayName];
        const elementBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elementArray), gl.STATIC_DRAW);
        this._buffers[elementArrayName] = elementBuffer;
    }

    delete() {
        for (const bufferName in this._buffers) {
            this._gl.deleteBuffer(this._buffers[bufferName]);
        }
    }

    attributeNames(): string[] {
        return Object.keys(this._attributes);
    }

    attributeBindingFunction(attributeName: string): MeshAttributeBinder {
        var gl = this._gl;
        var buffer = this._buffers[attributeName];
        var attribute = this._attributes[attributeName];
        var dimension = attribute.dimension;
        var stride = attribute.stride;
        var offset = attribute.offset;

        return (attributeLoc: number) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.enableVertexAttribArray(attributeLoc);
            gl.vertexAttribPointer(attributeLoc, dimension, gl.FLOAT, false, stride, offset);
        }
    }

    draw() {
        const gl = this._gl;

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffers[this._elementArrayName]);
        gl.drawElements(this._drawMode, this._elementCount, gl.UNSIGNED_SHORT, 0);
    }
}
