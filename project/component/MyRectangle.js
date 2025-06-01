import { CGFobject } from "../../lib/CGF.js";

/**
 * @brief Class representing a rectangle.
 *
 * This class creates a rectangle with specified width and height.
 * It can be rendered with or without double-sided normals.
 */
export class MyRectangle extends CGFobject {
    /**
     * @brief Creates a rectangle.
     *
     * @param {CGFscene} scene - The scene to which the rectangle belongs.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {boolean} [doubleSided=false] - Whether the rectangle should be double-sided.
     */
    constructor(scene, width, height, doubleSided = false) {
        super(scene);
        this.width = width;
        this.height = height;
        this.doubleSided = doubleSided;

        this.initBuffers();
    }

    /**
     * @brief Initializes the buffers for the rectangle.
     */
    initBuffers() {
        this.vertices = [
            0, 0, 0,
            this.width, 0, 0,
            this.width, this.height, 0,
            0, this.height, 0,
        ]

        this.indices = [
            0, 1, 2,
            2, 3, 0,
        ];
        if (this.doubleSided) {
            this.indices.push(
                0, 3, 2,
                2, 1, 0,
            );
        }

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ];

        this.texCoords = [
            0, 1,
            1, 1,
            1, 0,
            0, 0,
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * @brief Updates the size of the rectangle.
     *
     * @param {number} width - The new width of the rectangle.
     * @param {number} height - The new height of the rectangle.
     */
    updateSize(width, height) {
        this.width = width;
        this.height = height;

        this.initBuffers();
    }
}