import {Mesh} from "./Mesh";

export function Square(gl: WebGLRenderingContext): Mesh {
    return new Mesh(gl, gl.TRIANGLE_STRIP, "elements", {
        "positions": [
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, 1.0, 0.0
        ],
        "colors": [
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0,
            0.2, 0.5, 0.1
        ],
        "elements": [0, 1, 2, 3]
    }, {
        "positions": {
            "key": "positions",
            "dimension": 3,
            "stride": 12,
            "offset": 0
        },
        "colors": {
            "key": "colors",
            "dimension": 3,
            "stride": 12,
            "offset": 0
        }
    })
}