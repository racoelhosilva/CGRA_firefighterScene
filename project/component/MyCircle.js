import { CGFobject } from "../../lib/CGF.js";

/**
 * @brief Class representing a 2D circle.
 *
 * This class creates a circle with a specified number of slices and radius.
 */
export class MyCircle extends CGFobject {
    /**
     * @brief Creates a new circle object.
     *
     * @param {CGFscene} scene - The scene to which the circle belongs.
     * @param {number} slices - The number of slices for the circle.
     * @param {number} radius - The radius of the circle.
     */
    constructor(scene, slices, radius) {
        super(scene);

        this.slices = slices;
        this.radius = radius;

        this.initBuffers()
    }

    /**
     * @brief Initializes the buffers for the circle.
     */
    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];

        this.vertices.push(0, 0, 0);
        this.normals.push(0, 1, 0);
        this.texCoords.push(0.5, 0.5);

        for (let i = 0; i <= this.slices; i++) {
            const angle = (i * 2 * Math.PI) / this.slices;
            const x = this.radius * Math.cos(angle);
            const z = this.radius * Math.sin(angle);

            this.vertices.push(x, 0, z);
            this.normals.push(0, 1, 0);
            this.texCoords.push((x / this.radius + 1) / 2, (z / this.radius + 1) / 2);
        }

        for (let i = 1; i <= this.slices; i++) {
            this.indices.push(i, 0, (i % this.slices) + 1);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}