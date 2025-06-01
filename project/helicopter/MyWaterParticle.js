import { CGFobject, CGFappearance, CGFscene } from "../../lib/CGF.js";
import { MySphere } from "../component/MySphere.js";

/**
 * @brief Class representing a water particle in the scene.
 */
export class MyWaterParticle extends CGFobject {
    /**
     * @brief Creates a new water particle object.
     *
     * @param {CGFscene} scene - The scene to which the water particle belongs.
     * @param {Array<number>} position - The initial position of the water particle in the scene.
     * @param {number} randomFactor - A factor to randomize the speed of the water particle.
     */
    constructor(scene, position, randomFactor) {
        super(scene);
        this.scene = scene;
        this.position = position;
        this.speed = 0.3 * randomFactor;

        this.particle = new MySphere(this.scene, randomFactor, 2, 4);
    }

    display() {
        this.scene.pushMatrix();
        this.particle.display();
        this.scene.popMatrix();
    }

    /**
     * @brief Updates the position of the water particle.
     *
     * @param {number} deltaT - The time since the last update.
     */
    update(deltaT) {
        this.position[1] -= this.speed * deltaT;
    }
}