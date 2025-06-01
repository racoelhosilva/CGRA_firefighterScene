import { CGFappearance, CGFobject, CGFscene, CGFshader, CGFtexture } from '../../lib/CGF.js';
import { MyBlaze } from './MyBlaze.js';

/**
 * @brief Class representing a fire in the scene.
 *
 * Each fire is composed of multiple ondulating triangles (MyBlaze objects).
 */
export class MyFire extends CGFobject {
    /**
     * @brief Creates a fire object.
     *
     * @param {CGFscene} scene - The scene to which the fire belongs.
     * @param {number} radius - The radius of the fire.
     * @param {number} height - The height of the fire (which affects whe min and max height of the blazes).
     * @param {number} numBlazes - The number of blazes that make up the fire.
     * @param {Array<number>} center - The center position of the fire in the scene, given as an array [x, y, z].
     * @param {CGFtexture} texture - The texture to apply to the fire.
     * @param {CGFshader} shader - The shader to use for rendering the fire.
     */
    constructor(scene, radius, height, numBlazes, center, texture, shader) {
        super(scene);

        this.radius = radius;
        this.height = height;
        this.center = center;
        this.numBlazes = numBlazes;

        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(0.0, 0.0, 0.0, 0.0);
        this.material.setDiffuse(0.0, 0.0, 0.0, 0.0);
        this.material.setSpecular(0.0, 0.0, 0.0, 0.0);
        this.material.setTexture(texture);

        this.shader = shader;

        this.blazes = this.buildBlazes();
        this.heightFactor = 1.0;  // The height factor reduces as the fire is put down
    }

    /**
     * @brief Builds the blazes that make up the fire.
     *
     * @returns {Array<MyBlaze>} - An array of MyBlaze objects representing the fire's blazes.
     */
    buildBlazes() {
        let blazes = [];
        for (let i = 0; i < this.numBlazes; i++) {
            blazes.push(new MyBlaze(this.scene, this.height / 3, this.height, this.radius / this.height, this.material, this));
        }
        return blazes;
    }

    /**
     * @brief Gets the radius of the fire.
     *
     * @return {number} - The radius of the fire.
     */
    getHeightFactor() {
        return this.heightFactor;
    }

    /**
     * @brief Sets the height factor of the fire.
     *
     * @param {number} heightFactor - The new height factor to set for the fire.
     */
    setHeightFactor(heightFactor) {
        this.heightFactor = Math.max(heightFactor, 0.0);
    }

    display() {
        if (this.heightFactor == 0)
            return;  // If height factor is == 0, no need to display

        this.scene.pushMatrix();
        this.scene.translate(this.center[0], this.center[1], this.center[2]);
        this.scene.scale(1, this.heightFactor, 1);

        this.scene.setActiveShader(this.shader);

        for (let i = 0; i < this.numBlazes; i++) {
            this.blazes[i].display();
        }

        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.popMatrix();
    }

    /**
     * @brief Calculates the difference between two 3D vectors.
     *
     * @param {Array<number>} v1 - First vector.
     * @param {Array<number>} v2 - Second vector.
     *
     * @returns {Array<number>} - The resulting vector after subtraction, representing the difference between v1 and v2.
     */
    difference(v1, v2) {
        return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
    }

    /**
     * @brief Calculates the squared length of a 3D vector, considering only the x and z directions.
     *
     * @param {Array<number>} v - Input vector.
     *
     * @returns {number} - The squared length of the vector.
     */
    squaredLength(v) {
        return v[0] * v[0] + v[2] * v[2];
    }

    /**
     * @brief Checks if a given position collides with (i.e. is above) the fire.
     *
     * @param {Array<number>} position - The position to check, given as an array [x, y, z].
     *
     * @returns {boolean} - True if the position collides with the fire, false otherwise.
     */
    collidesWith(position) {
        return this.squaredLength(this.difference(position, this.center)) < this.radius * this.radius;
    }

    /**
     * @brief Generates multiple fire objects within a specified area.
     *
     * @param {CGFscene} scene - The scene to which the fires will be added.
     * @param {Array<number>} topLeft - The top-left corner of the area in the xOz plane.
     * @param {Array<number>} bottomRight - The bottom-right corner of the area in the xOz plane.
     * @param {number} numFires - The number of fires to generate.
     * @param {CGFtexture} texture - The texture to apply to the fires.
     * @param {CGFshader} shader - The shader to use for rendering the fires.
     * @returns {Array<MyFire>} - An array of the generated fires.
     */
    static generateFires(scene, topLeft, bottomRight, numFires, texture, shader) {
        const fires = [];

        for (let i = 0; i < numFires; i++) {
            const radius = 10 + Math.random() * (40 - 10);
            const height = radius * 1.5;
            const centerX = Math.random() * (bottomRight[0] - topLeft[0]) + topLeft[0];
            const centerZ = Math.random() * (bottomRight[2] - topLeft[2]) + topLeft[2];
            const centerY = 0;  // Fires generated at ground level

            fires.push(new MyFire(scene, radius, height, 10, [centerX, centerY, centerZ], texture, shader));
        }

        return fires;
    }
}