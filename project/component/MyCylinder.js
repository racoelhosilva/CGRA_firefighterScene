import { CGFobject } from "../../lib/CGF.js";

export class MyCylinder extends CGFobject {
    constructor(scene, radius, height, slices, stacks, doubleSided = false) {
        super(scene);

        this.radius = radius;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
        this.doubleSided = doubleSided;

        this.initBuffers();
    }

    pushVertices() {
        for (let stack = 0; stack <= this.stacks; stack++) {
            const y = this.height * stack / this.stacks;
            const v = 1 - stack / this.stacks;

            for (let slice = 0; slice <= this.slices; slice++) {
                const alpha = 2 * Math.PI * slice / this.slices;
                const [x, z] = [Math.cos(alpha), Math.sin(alpha)];
                const u = slice / this.slices;

                this.vertices.push(this.radius * x, y, this.radius * z);
                this.normals.push(x, 0, z);
                this.texCoords.push(u, v);
            }
        }

        if (!this.doubleSided)
            return;

        this.vertices.push(...this.vertices);
        this.normals.push(...this.normals.map(v => -v));
        this.texCoords.push(...this.texCoords);
    }

    pushFaces() {
        // Outside faces
        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const bottomRight = stack * (this.slices + 1) + slice;
                const bottomLeft = bottomRight + 1;
                const topRight = bottomRight + this.slices + 1;
                const topLeft = bottomRight + this.slices + 2;

                this.indices.push(bottomRight, topRight, topLeft);
                this.indices.push(topLeft, bottomLeft, bottomRight);
            }
        }

        if (!this.doubleSided)
            return;

        // Inside faces
        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const bottomRight = (this.stacks + 1 + stack) * (this.slices + 1) + slice;
                const bottomLeft = bottomRight + 1;
                const topRight = bottomRight + this.slices + 1;
                const topLeft = bottomRight + this.slices + 2;

                this.indices.push(bottomRight, bottomLeft, topLeft);
                this.indices.push(topLeft, topRight, bottomRight);
            }
        }
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
}