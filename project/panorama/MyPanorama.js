import { CGFappearance, CGFobject, CGFscene, CGFtexture } from "../../lib/CGF.js";
import { MySphere } from "../component/MySphere.js";

/**
 * @brief Class representing the panorama in the scene.
 */
export class MyPanorama extends CGFobject {
    /**
     * @brief Creates a panorama object.
     *
     * @param {CGFscene} scene - The scene to which the panorama belongs.
     * @param {number} radius - The radius of the sphere representing the panorama.
     * @param {number} stacks - The number of stacks to use when creating the sphere.
     * @param {number} slices - The number of slices to use when creating the sphere.
     * @param {CGFtexture} texture - The texture to apply to the panorama.
     */
    constructor(scene, radius, stacks, slices, texture) {
        super(scene);

        this.sphere = new MySphere(scene, radius, stacks, slices, true);
        this.material = new CGFappearance(scene);
        this.material.setEmission(1.0, 1.0, 1.0, 1.0);
        this.material.setTexture(texture);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(...this.scene.camera.position);
        this.scene.rotate(-Math.PI / 6, 0, 1, 0);
        this.material.apply();
        this.sphere.display();
        this.scene.popMatrix();
    }

    /**
     * @brief Updates the texture of the panorama.
     *
     * @param {CGFtexture} texture - The new texture to apply to the panorama.
     */
    updateTexture(texture) {
        this.material.setTexture(texture);
    }
}