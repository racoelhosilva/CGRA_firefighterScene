import { CGFobject } from "../../lib/CGF.js";

/**
 * @brief Class representing a cone object.
 *
 * This class creates a cone with a specified number of slices, radius, and height.
 */
export class MyCone extends CGFobject {
    /**
     * @brief Creates a new cone object.
     *
     * @param {CGFscene} scene - The scene to which the cone belongs.
     * @param {number} slices - The number of slices for the cone's base.
     * @param {number} radius - The radius of the cone's base.
     * @param {number} height - The height of the cone.
     */
    constructor(scene, slices, radius, height) {
        super(scene);

        this.slices = slices;
        this.radius = radius;
        this.height = height;

        this.initBuffers()
    }

    /**
     * @brief Initializes the buffers for the cone.
     */
    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];

        this.pushVertices();
        this.pushFaces();

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * @brief Pushes the vertices, normals, and texture coordinates for the cone.
     */
    pushVertices() {
        // Top vertex
        this.vertices.push(0, this.height, 0);
        this.normals.push(0, 1, 0);
        this.texCoords.push(0.5, 0.5);

        // Base vertices
        for (let slice = 0; slice < this.slices; slice++) {
            const alpha = 2 * Math.PI * slice / this.slices;
            const [nx, nz] = [Math.cos(alpha), Math.sin(alpha)];

            this.vertices.push(this.radius * nx, 0, this.radius * nz);
            this.normals.push(nx, 0, nz);
            this.texCoords.push((1 + nx) / 2, (1 + nz) / 2);
        }
    }

    /**
     * @brief Pushes the indices for the cone's faces.
     */
    pushFaces() {
        for (let slice = 0; slice < this.slices - 1; slice++)
            this.indices.push(slice + 1, 0, slice + 2);
        this.indices.push(this.slices, 0, 1);
    }
}