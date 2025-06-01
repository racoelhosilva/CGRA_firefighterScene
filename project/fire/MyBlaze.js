import { CGFappearance, CGFobject, CGFscene } from '../../lib/CGF.js';
import { MyTriangle } from '../component/MyTriangle.js';
import { MyFire } from './MyFire.js';

/**
 * @brief Class representing a blaze in the scene.
 *
 * Each blaze is represented as a triangle with a random height, color and complexity.
 */
export class MyBlaze extends CGFobject {
    FIRE_MIN_GREEN = 0.2;
    FIRE_MAX_GREEN = 0.7;

    /**
     * @brief Creates a blaze object.
     *
     * @param {CGFscene} scene - The scene to which the blaze belongs.
     * @param {number} minHeight - The minimum height of the blaze.
     * @param {number} maxHeight - The maximum height of the blaze.
     * @param {number} radiusRatio - The ratio of the blaze's radius to its height.
     * @param {CGFappearance} material - The material to apply to the blaze.
     * @param {MyFire} fire - The fire object to which the blaze belongs.
     */
    constructor(scene, minHeight, maxHeight, radiusRatio, material, fire) {
        super(scene);

        this.triangle = this.buildTriangle(minHeight, maxHeight, radiusRatio);

        this.material = material;
        this.fire = fire;

        this.green = this.buildGreen(this.triangle.p3, minHeight, maxHeight);
        this.randomFactor = 0.5 + Math.random() * 1.5;
    }

    /**
     * @brief Generates the triangle used for the blaze.
     *
     * @param {number} minHeight - The minimum height of the blaze.
     * @param {number} maxHeight - The maximum height of the blaze.
     * @param {number} radiusRatio - The ratio of the blaze's radius to its height.
     *
     * @returns {MyTriangle} - The blaze's triangle.
     */
    buildTriangle(minHeight, maxHeight, radiusRatio) {
        const height = minHeight + Math.random() ** 1.4 * (maxHeight - minHeight);
        const radius = radiusRatio * height;

        const base1 = this.buildRandomBaseVertex(radius);
        const base2 = this.buildRandomBaseVertex(radius);
        const top = this.buildRandomTopVertex(height, base1, base2);

        return new MyTriangle(this.scene, base1, base2, top, Math.round(8 * top[1] / maxHeight), true);
    }

    /**
     * @brief Calculates the green color value for the blaze based on its height.
     *
     * @param {Array<number>} topVertex - The top vertex of the blaze's triangle.
     * @param {number} minHeight - The minimum height of the blaze.
     * @param {number} maxHeight - The maximum height of the blaze.
     *
     * @returns {number} - The green color value for the blaze's appearance.
     */
    buildGreen(topVertex, minHeight, maxHeight) {
        const heightRatio = (maxHeight - topVertex[1]) / (maxHeight - minHeight);
        return this.FIRE_MIN_GREEN + heightRatio * (this.FIRE_MAX_GREEN - this.FIRE_MIN_GREEN);
    }

    /**
     * @brief Generates a random base vertex for the blaze's triangle.
     *
     * @param {number} radius - The radius of the blaze's base.
     *
     * @returns {Array<number>} - The base vertex created.
     */
    buildRandomBaseVertex(radius) {
        const [r, theta] = [Math.random() * radius, Math.random() * 2 * Math.PI];
        const [x, z] = [r * Math.cos(theta), r * Math.sin(theta)];

        return [x, 0, z];
    }

    /**
     * @brief Generates the top vertex of the blaze's triangle, based on the base vertices.
     *
     * @param {number} height - The height of the blaze.
     * @param {Array<number>} baseVertex1 - The first base vertex of the blaze's triangle.
     * @param {Array<number>} baseVertex2 - The second base vertex of the blaze's triangle.
     *
     * @returns {Array<number>} - The top vertex created.
     */
    buildRandomTopVertex(height, baseVertex1, baseVertex2) {
        const [x, z] = [(baseVertex1[0] + baseVertex2[0]) / 2, (baseVertex1[2] + baseVertex2[2]) / 2];
        return [x, height, z];
    }

    display() {
        this.fire.shader.setUniformsValues({ green: this.green, randomFactor: this.randomFactor });
        this.material.apply();
        this.triangle.display();
    }
}