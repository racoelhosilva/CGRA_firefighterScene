import { CGFobject } from "../../lib/CGF.js";

/**
 * @brief Class representing a parallelogram.
 *
 * This class creates a parallelogram with specified width, height, and angle.
 * It can also be configured to be double-sided.
 */
export class MyParallelogram extends CGFobject {
    /**
     * @brief Constructs a MyParallelogram object.
     *
     * @param {CGFscene} scene - The scene to which the parallelogram belongs.
     * @param {number} width - The width of the parallelogram.
     * @param {number} height - The height of the parallelogram.
     * @param {number} angle - The angle of the parallelogram in radians.
     * @param {boolean} [doubleSided=false] - Whether the parallelogram is double-sided.
     */
    constructor(scene, width, height, angle, doubleSided = false) {
        super(scene);

        this.width = width;
        this.height = height;
        this.angle = angle;
        this.doubleSided = doubleSided;

        this.initBuffers();
    }

    /**
     * @brief Initializes the buffers for the parallelogram.
     */
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

    /**
     * @brief Pushes the vertices, normals, and texture coordinates into their respective arrays.
     */
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

    /**
     * @brief Pushes the indices for the faces of the parallelogram into the indices array.
     */
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