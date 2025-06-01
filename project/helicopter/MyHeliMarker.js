import { CGFobject, CGFappearance, CGFscene } from '../../lib/CGF.js';
import { MyCylinder } from '../component/MyCylinder.js';
import { MyHeli } from './MyHeli.js';

/**
 * @brief Class representing a helicopter marker in the scene.
 *
 * The helicopter marker denotes the direction to which the water drops, and is
 * represented by a translucid cylinder below the helicopter.
 */
export class MyHeliMarker extends CGFobject {
    /**
     * @brief Creates a helicopter marker object.
     *
     * @param {CGFscene} scene - The scene to which the marker belongs.
     * @param {MyHeli} helicopter - The helicopter to which the marker is attached.
     * @param {Array<number>} color - The color of the marker, in RGB format.
     */
    constructor(scene, helicopter, color) {
        super(scene);

        this.helicopter = helicopter;
        this.circle = new MyCylinder(scene, 1, 1000, 10, 1);

        this.material = new CGFappearance(scene);
        this.material.setAmbient(0.0, 0.0, 0.0, 0.0);
        this.material.setDiffuse(0.0, 0.0, 0.0, 0.0);
        this.material.setSpecular(0.0, 0.0, 0.0, 0.0);
        this.material.setEmission(...color, 0.5);
        this.material.setShininess(10.0);
    }

    display() {
        if (this.helicopter.isEmpty())
            return; // Do not display marker if helicopter has no water

        this.material.apply();
        this.scene.pushMatrix();

        // Displace top to the bottom of the bucket
        const translateY = this.helicopter.position[1]
            - (this.helicopter.bucketHeight - this.helicopter.HELICOPTER_BOTTOM_HEIGHT)
            * this.helicopter.scaleFactor;
        this.scene.translate(
            this.helicopter.position[0],
            translateY,
            this.helicopter.position[2]
        );

        this.scene.rotate(Math.PI, 1, 0, 0);
        this.circle.display();
        this.scene.popMatrix();
    }

    /**
     * @brief Updates the color of the marker.
     *
     * @param {Array<number>} color - The new color of the marker, in RGB format.
     */
    updateColor(color) {
        this.material.setEmission(...color, 0.5);
    }
}