import { CGFobject } from "../../lib/CGF.js";

/**
 * @brief Class representing an ellipsoid object.
 *
 * This class creates an ellipsoid with customizable radii, stacks, and slices.
 * It allows for the creation of both normal and inverted ellipsoids.
 */
export class MyEllipsoid extends CGFobject {
    /**
     * @brief Constructs an ellipsoid object.
     *
     * @param {CGFscene} scene - The scene to which the ellipsoid belongs.
     * @param {number} rx - The radius along the x-axis.
     * @param {number} ry - The radius along the y-axis.
     * @param {number} rz - The radius along the z-axis.
     * @param {number} stacks - The number of stacks (horizontal divisions).
     * @param {number} slices - The number of slices (vertical divisions).
     * @param {boolean} [inverted=false] - Whether the ellipsoid is inverted.
     */
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

    /**
     * @brief Pushes a vertex with its normal and texture coordinates to the buffers.
     *
     * @param {number} x - The x-coordinate of the vertex.
     * @param {number} y - The y-coordinate of the vertex.
     * @param {number} z - The z-coordinate of the vertex.
     * @param {number} u - The u texture coordinate.
     * @param {number} v - The v texture coordinate.
     */
    pushVertex(x, y, z, u, v) {
        this.vertices.push(x, y, z);
        this.normals.push(x * this.invSqrRx, y * this.invSqrRy, z * this.invSqrRz);
        this.texCoords.push(u, v);
    }

    /**
     * @brief Pushes a vertex at the poles of the ellipsoid.
     *
     * @param {boolean} isNorth - True for the north pole, false for the south pole.
     * @param {number} slice - The slice index for the pole.
     */
    pushPole(isNorth, slice) {
        const [x, y, z] = [0, isNorth ? this.ry : -this.ry, 0];
        const [u, v] = [(2 * slice + 1) / (2 * this.slices), isNorth ? 0 : 1];

        this.pushVertex(x, y, z, u, v);
    }

    /**
     * @brief Pushes a vertex in the middle of the ellipsoid.
     *
     * @param {number} stack - The stack index for the vertex.
     * @param {number} slice - The slice index for the vertex.
     */
    pushMiddleVertex(stack, slice) {
        const gamma = 2 * Math.PI * slice / this.slices;
        const beta = Math.PI / 2 * stack / this.stacks;
        const r = Math.cos(beta);

        const [x, y, z] = [this.rx * r * Math.cos(gamma), this.ry * Math.sin(beta), this.rz * r * Math.sin(gamma)];
        const [u, v] = [slice / this.slices, (this.stacks - stack) / (2 * this.stacks)];

        this.pushVertex(x, y, z, u, v);
    }

    /**
     * @brief Pushes all vertices of the ellipsoid to the buffers.
     */
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

    /**
     * @brief Pushes a triangle to the indices buffer.
     *
     * @param {number} i - The index of the first vertex.
     * @param {number} j - The index of the second vertex.
     * @param {number} k - The index of the third vertex.
     */
    pushTriangle(i, j, k) {
        if (!this.inverted) {
            this.indices.push(i, j, k);
        } else {
            this.indices.push(i, k, j);
        }
    }

    /**
     * @brief Pushes the face of a pole to the indices buffer.
     *
     * @param {boolean} isNorth - True for the north pole, false for the south pole.
     * @param {number} slice - The slice index for the pole face.
     */
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

    /**
     * @brief Pushes the face of a middle section of the ellipsoid to the indices buffer.
     *
     * @param {number} stack - The stack index for the middle face.
     * @param {number} slice - The slice index for the middle face.
     */
    pushMiddleFace(stack, slice) {
        const bottomRight = this.slices + (this.stacks - 1 + stack) * (this.slices + 1) + slice;
        const bottomLeft = bottomRight + 1;
        const topRight = bottomRight + this.slices + 1;
        const topLeft = bottomRight + this.slices + 2;

        this.pushTriangle(bottomRight, topRight, topLeft);
        this.pushTriangle(topLeft, bottomLeft, bottomRight);
    }

    /**
     * @brief Pushes all faces of the ellipsoid to the indices buffer.
     */
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

    /**
     * @brief Initializes the buffers for the ellipsoid.
     */
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