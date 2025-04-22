import { CGFobject } from "../lib/CGF.js";

export class MyHelipad extends CGFobject {
    constructor(scene, width, depth) {
        super(scene);
        this.width = width;
        this.depth = depth;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            this.width, 0, this.depth,
            this.width, 0, 0,
            0, 0, 0,
            0, 0, this.depth,
        ]

        this.indices = [
            0, 1, 2,
            0, 2, 3,
        ];
    
        this.normals = [
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
        ];

        this.texCoords = [
            1, 1,
            1, 0,
            0, 0,
            0, 1,
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateSize(width, depth) {
        this.width = width;
        this.depth = depth;

        this.initBuffers();
        this.initNormalVizBuffers();
    }
}