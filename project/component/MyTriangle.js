import { CGFobject } from "../../lib/CGF.js";

/**
 * @brief Class representing a triangle in 3D space.
 *
 * This class creates a triangle defined by three points in 3D space.
 * It supports a specified level of complexity for the mesh and can be rendered double-sided.
 */
export class MyTriangle extends CGFobject {
    /**
     * @brief Creates a triangle object.
     *
     * @param {CGFscene} scene - The scene in which the triangle will be rendered.
     * @param {Array<number>} p1 - The first vertex of the triangle as an array [x, y, z].
     * @param {Array<number>} p2 - The second vertex of the triangle as an array [x, y, z].
     * @param {Array<number>} p3 - The third vertex of the triangle as an array [x, y, z].
     * @param {number} [complexity=0] - The complexity of the triangle mesh, determining the number of subdivisions.
     * @param {boolean} [doubleSided=false] - Whether the triangle should be rendered double-sided.
     */
    constructor(scene, p1, p2, p3, complexity = 0, doubleSided = false) {
        super(scene);
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.complexity = complexity;
        this.doubleSided = doubleSided;

        this.initBuffers();
    }

    /**
     * @brief Pushes vertices, texture coordinates, and normals to the buffers.
     */
    pushVertices() {
        const normal = this.normalize(this.crossProduct(this.difference(this.p2, this.p1), this.difference(this.p3, this.p1)));

        for (let i = 0; i <= this.complexity + 1; i++) {
            for (let j = 0; j <= this.complexity - i + 1; j++) {
                const u = i / (this.complexity + 1);
                const v = j / (this.complexity + 1);
                const w = (this.complexity + 1 - i - j) / (this.complexity + 1);

                this.vertices.push(
                    u * this.p1[0] + v * this.p2[0] + w * this.p3[0],
                    u * this.p1[1] + v * this.p2[1] + w * this.p3[1],
                    u * this.p1[2] + v * this.p2[2] + w * this.p3[2]
                );

                this.texCoords.push(
                    u * 0 + v * 1 + w * 0.5,
                    u * 1 + v * 1 + w * 0
                );

                this.normals.push(
                    ...normal,
                    ...normal,
                    ...normal
                );
            }
        }

        if (this.doubleSided) {
            this.vertices.push(...this.vertices);
            this.texCoords.push(...this.texCoords);
            this.normals.push(...this.normals.map((n) => -n));
        }
    }

    /**
     * @brief Calculates the difference between two vectors.
     *
     * @param {Array<number>} v1 - The first vector.
     * @param {Array<number>} v2 - The second vector.
     * @returns {Array<number>} The resulting vector after subtraction.
     */
    difference(v1, v2) {
        return [
            v1[0] - v2[0],
            v1[1] - v2[1],
            v1[2] - v2[2]
        ];
    }

    /**
     * @brief Calculates the cross product of two vectors.
     *
     * @param {Array<number>} v1 - The first vector.
     * @param {Array<number>} v2 - The second vector.
     * @return {Array<number>} The resulting vector from the cross product.
     */
    crossProduct(v1, v2) {
        return [
            v1[1] * v2[2] - v1[2] * v2[1],
            v1[2] * v2[0] - v1[0] * v2[2],
            v1[0] * v2[1] - v1[1] * v2[0]
        ];
    }

    /**
     * @brief Normalizes a vector to unit length.
     *
     * @param {Array<number>} v - The vector to normalize.
     * @return {Array<number>} The normalized vector.
     */
    normalize(v) {
        const length = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
        return [
            v[0] / length,
            v[1] / length,
            v[2] / length
        ];
    }

    /**
     * @brief Pushes the indices for the triangle faces into the indices buffer.
     */
    pushFaces() {
        for (let u = 0; u < this.complexity + 1; u++) {
            for (let v = 0; v < this.complexity - u + 1; v++) {
                const a = u * (this.complexity + 3 - (u + 1) / 2) + v;
                const b = a + this.complexity - u + 2;
                const c = a + 1;

                this.indices.push(a, b, c);
                if (v < this.complexity - u) {
                    const d = b + 1;
                    this.indices.push(b, d, c);
                }
            }
        }

        if (this.doubleSided) {
            const halfVertices = this.vertices.length / 6;
            this.indices.push(...this.indices.map(index => index + halfVertices).reverse());
        }
    }

    /**
     * @brief Initializes the buffers for the triangle.
     */
    initBuffers() {
        this.vertices = [];
        this.texCoords = [];
        this.normals = [];
        this.indices = [];

        this.pushVertices();
        this.pushFaces();

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
