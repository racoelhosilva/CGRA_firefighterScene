import { MyEllipsoid } from "./MyEllipsoid.js";

/**
 * @brief Represents a sphere in 3D space.
 */
export class MySphere extends MyEllipsoid {
    /**
     * @brief Constructs a sphere with the given parameters.
     *
     * @param {CGFscene} scene - The scene to which the sphere belongs.
     * @param {number} radius - The radius of the sphere.
     * @param {number} stacks - The number of stacks (horizontal divisions).
     * @param {number} slices - The number of slices (vertical divisions).
     * @param {boolean} [inverted=false] - Whether the sphere is inverted (default is false).
     */
    constructor(scene, radius, stacks, slices, inverted = false) {
        super(scene, radius, radius, radius, stacks, slices, inverted);
    }
}