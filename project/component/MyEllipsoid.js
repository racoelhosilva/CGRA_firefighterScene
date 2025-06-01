import { CGFobject } from "../../lib/CGF.js";

export class MyEllipsoid extends CGFobject {
    constructor(scene, rx, ry, rz, stacks, slices, inverted = false) {
        super(scene)

        this.rx = rx;
        this.ry = ry;
        this.rz = rz;
        this.stacks = stacks;
        this.slices = slices;
        this.inverted = inverted;

        this.invSqrRx = 1 / (rx * rx);
        this.invSqrRy = 1 / (ry * ry);
        this.invSqrRz = 1 / (rz * rz);

        this.initBuffers();
    }

    pushVertex(x, y, z, u, v) {
        this.vertices.push(x, y, z);
        this.normals.push(x * this.invSqrRx, y * this.invSqrRy, z * this.invSqrRz);
        this.texCoords.push(u, v);
    }

    pushPole(isNorth, slice) {
        const [x, y, z] = [0, isNorth ? this.ry : -this.ry, 0];
        const [u, v] = [(2 * slice + 1) / (2 * this.slices), isNorth ? 0 : 1];

        this.pushVertex(x, y, z, u, v);
    }

    pushMiddleVertex(stack, slice) {
        const gamma = 2 * Math.PI * slice / this.slices;
        const beta = Math.PI / 2 * stack / this.stacks;
        const r = Math.cos(beta);

        const [x, y, z] = [this.rx * r * Math.cos(gamma), this.ry * Math.sin(beta), this.rz * r * Math.sin(gamma)];
        const [u, v] = [slice / this.slices, (this.stacks - stack) / (2 * this.stacks)];

        this.pushVertex(x, y, z, u, v);
    }

    pushAllVertices() {
        for (let slice = 0; slice < this.slices; slice++)
            this.pushPole(false, slice);

        for (let stack = -(this.stacks - 1); stack < this.stacks; stack++) {
            for (let slice = 0; slice <= this.slices; slice++) {
                this.pushMiddleVertex(stack, slice);
            }
        }

        for (let slice = 0; slice < this.slices; slice++)
            this.pushPole(true, slice);
    }

    pushTriangle(i, j, k) {
        if (!this.inverted) {
            this.indices.push(i, j, k);
        } else {
            this.indices.push(i, k, j);
        }
    }

    pushPoleFace(isNorth, slice) {
        let pole, left, right;
        if (isNorth) {
            pole = this.slices + (2 * this.stacks - 1) * (this.slices + 1) + slice;
            left = pole - this.slices;
            right = pole - this.slices - 1;
            this.pushTriangle(pole, left, right);

        } else {
            pole = slice;
            left = pole + this.slices + 1;
            right = pole + this.slices;
            this.pushTriangle(pole, right, left);
        }
    }

    pushMiddleFace(stack, slice) {
        const bottomRight = this.slices + (this.stacks - 1 + stack) * (this.slices + 1) + slice;
        const bottomLeft = bottomRight + 1;
        const topRight = bottomRight + this.slices + 1;
        const topLeft = bottomRight + this.slices + 2;

        this.pushTriangle(bottomRight, topRight, topLeft);
        this.pushTriangle(topLeft, bottomLeft, bottomRight);
    }

    pushAllFaces() {
        for (let slice = 0; slice < this.slices; slice++)
            this.pushPoleFace(false, slice);

        for (let stack = -(this.stacks - 1); stack < this.stacks - 1; stack++) {
            for (let slice = 0; slice < this.slices; slice++)
                this.pushMiddleFace(stack, slice);
        }

        for (let slice = 0; slice < this.slices; slice++)
            this.pushPoleFace(true, slice);
    }

    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];
        this.indices = [];

        this.pushAllVertices();
        this.pushAllFaces();

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}