import { CGFobject } from "../lib/CGF.js";

export class MyBanner extends CGFobject {
    constructor(scene, width, height) {
        super(scene);
        this.width = width;
        this.height = height;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            0, 0, 0,
            this.width, 0, 0,
            this.width, this.height, 0,
            0, this.height, 0,
        ]

        this.indices = [
            0, 1, 2,
            0, 2, 3,
        ];
    
        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ];

        this.texCoords = [
            0, 1,
            1, 1,
            1, 0,
            0, 0,
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateSize(width, height) {
        this.width = width;
        this.height = height;

        this.initBuffers();
        this.initNormalVizBuffers();
    }
}