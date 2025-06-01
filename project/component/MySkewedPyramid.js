import { CGFobject } from '../../lib/CGF.js';

/**
 * @brief Class representing a skewed pyramid.
 *
 * This class creates a skewed pyramid with a specified number of faces,
 * dimensions, and skewness.
 */
export class MySkewedPyramid extends CGFobject {
    /**
     * @brief Creates a new skewed pyramid object.
     *
     * @param {CGFscene} scene - The scene to which the pyramid belongs.
     * @param {number} faces - The number of triangular faces of the pyramid.
     * @param {number} rx - The radius of the base in the x-direction.
     * @param {number} rz - The radius of the base in the z-direction.
     * @param {number} height - The height of the pyramid.
     * @param {number} skewness - The skewness of the pyramid, affecting the top vertex position.
     */
    constructor(scene, faces, rx, rz, height, skewness) {
        super(scene);

        this.faces = faces;
        this.rx = rx;
        this.rz = rz;
        this.height = height;
        this.skewness = skewness;

        this.initBuffers();
    }

    /**
     * @brief Pushes the vertices, normals, and texture coordinates for the pyramid.
     */
    pushVertices() {
        for (let face = 0; face < this.faces; face++) {
            const alpha = 2 * Math.PI * face / this.faces;
            const nextAlpha = 2 * Math.PI * (face + 1) / this.faces;

            const faceVertices = [
                this.rx * Math.cos(alpha), 0, this.rz * Math.sin(alpha),          // Right vertex
                this.skewness, this.height, 0,                                    // Top vertex
                this.rx * Math.cos(nextAlpha), 0, this.rz * Math.sin(nextAlpha),  // Left vertex
            ];

            this.vertices.push(...faceVertices);

            const normal = this.getFaceNormal(faceVertices);
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
     * @brief Calculates the normal vector for a face given its vertices.
     *
     * @param {Array<number>} vertices - An array containing the vertices of the face.
     * @returns {Array<number>} The normal vector of the face.
     */
    getFaceNormal(vertices) {
        const [a, b, c] = [vertices.slice(0, 3), vertices.slice(3, 6), vertices.slice(6)];

        const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
        const e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];

        const cross = [
            e1[1] * e2[2] - e1[2] * e2[1],
            e1[2] * e2[0] - e1[0] * e2[2],
            e1[0] * e2[1] - e1[1] * e2[0],
        ];
        const length = Math.sqrt(cross[0] * cross[0] + cross[1] * cross[1] + cross[2] * cross[2]);

        return cross.map(coord => coord / length);
    }

    /**
     * @brief Pushes the indices for the triangular faces of the pyramid.
     */
    pushFaces() {
        for (let face = 0; face < this.faces; face++) {
            this.indices.push(face * 3, face * 3 + 1, face * 3 + 2);
        }
    }

    /**
     * @brief Initializes the buffers for the pyramid.
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