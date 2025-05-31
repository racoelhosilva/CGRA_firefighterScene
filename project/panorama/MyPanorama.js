import { CGFappearance, CGFobject } from "../../lib/CGF.js";
import { MySphere } from "../component/MySphere.js";

export class MyPanorama extends CGFobject {
    RADIUS = 2000;

    constructor(scene, stacks, slices, texture) {
        super(scene);

        this.sphere = new MySphere(scene, this.RADIUS, stacks, slices, true);
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

    updateTexture(texture) {
        this.material.setTexture(texture);
    }
}