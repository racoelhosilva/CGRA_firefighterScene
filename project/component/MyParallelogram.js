import { CGFobject } from "../../lib/CGF.js";

export class MyParallelogram extends CGFobject {
    constructor(scene, width, height, angle, doubleSided = false) {
        super(scene);

        this.width = width;
        this.height = height;
        this.angle = angle;
        this.doubleSided = doubleSided;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];
        this.indices = [];

        this.pushVertices();
        this.pushFaces();

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    pushVertices() {
        const x1 = Math.tan(this.angle) * this.height;
        const x2 = this.width;
        const x3 = x1 + x2;

        this.vertices.push(
            0, 0, 0,
            x2, 0, 0,
            x3, this.height, 0,
            x1, this.height, 0,
        );
        this.normals.push(
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        );
        this.texCoords.push(
            0, 1,
            1, 1,
            1, 0,
            0, 0,
        );

        if (this.doubleSided) {
            this.vertices.push(...this.vertices);
            this.normals.push(
                0, 0, -1,
                0, 0, -1,
                0, 0, -1,
                0, 0, -1,
            );
            this.texCoords.push(...this.texCoords);
        }
    }

    pushFaces() {
        this.indices.push(
            0, 1, 2,
            2, 3, 0,
        );
        if (this.doubleSided) {
            this.indices.push(
                4, 7, 6,
                6, 5, 4,
            );
        }
    }
}