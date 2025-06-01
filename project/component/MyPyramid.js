import { CGFobject } from '../../lib/CGF.js';

/**
 * @brief Class for a pyramid object.
 *
 * This class creates a pyramid with a specified number of faces, radius, and height.
 */
export class MyPyramid extends CGFobject {
    /**
     * @brief Constructs a pyramid object.
     *
     * @param {CGFscene} scene - The scene to which the pyramid belongs.
     * @param {number} faces - The number of triangular faces of the pyramid.
     * @param {number} radius - The radius of the base of the pyramid.
     * @param {number} height - The height of the pyramid.
     */
    constructor(scene, faces, radius, height) {
        super(scene);
        this.faces = faces;
        this.radius = radius;
        this.height = height;

        this.initBuffers();
    }

    /**
     * @brief Pushes the vertices, normals, and texture coordinates for the pyramid.
     */
    pushVertices() {
        for (let face = 0; face < this.faces; face++) {
            const alpha = 2 * Math.PI * face / this.faces;
            const nextAlpha = 2 * Math.PI * (face + 1) / this.faces;

            this.vertices.push(
                this.radius * Math.cos(alpha), 0, this.radius * Math.sin(alpha),          // Right vertex
                0, this.height, 0,                                                        // Top vertex
                this.radius * Math.cos(nextAlpha), 0, this.radius * Math.sin(nextAlpha),  // Left vertex
            );

            const midAngle = (alpha + nextAlpha) / 2;
            const beta = Math.atan2(this.radius, this.height);
            const normRadius = Math.cos(beta);
            const normal = [normRadius * Math.cos(midAngle), Math.sin(beta), normRadius * Math.sin(midAngle)];
            this.normals.push(
                ...normal,
                ...normal,
                ...normal,
            );

            this.texCoords.push(
                0, 1,
                0.5, 0,
                1, 1,
            );
        }
    }

    /**
     * @brief Pushes the indices for the pyramid faces.
     */
    pushFaces() {
        for (let face = 0; face < this.faces; face++) {
            this.indices.push(face * 3, face * 3 + 1, face * 3 + 2);
        }
    }

    /**
     * @brief Initializes the buffers for the pyramid object.
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
}