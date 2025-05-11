import { CGFobject } from "../../lib/CGF.js";

export class MyRectangle extends CGFobject {
    constructor(scene, width, height, doubleSided = false) {
        super(scene);
        this.width = width;
        this.height = height;
        this.doubleSided = doubleSided;

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
            2, 3, 0,
        ];
        if (this.doubleSided) {
            this.indices.push(
                0, 3, 2,
                2, 1, 0,
            );
        }

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
    }
}