import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MySphere } from "../component/MySphere.js";

export class MyWaterParticle extends CGFobject {
    constructor(scene, position, randomFactor) {
        super(scene);
        this.scene = scene;
        this.position = position;
        this.speed = 0.3 * randomFactor;

        this.particle = new MySphere(this.scene, randomFactor, 2, 4);

        // Particle material
        this.waterMaterial = new CGFappearance(this.scene);
        this.waterMaterial.setAmbient(0.1, 0.1, 0.8, 1.0);
        this.waterMaterial.setDiffuse(0.1, 0.1, 0.8, 1.0);
        this.waterMaterial.setSpecular(0.2, 0.2, 0.8, 1.0);
        this.waterMaterial.setShininess(10);
    }

    display() {
        this.scene.pushMatrix();
        this.waterMaterial.apply();
        this.particle.display();
        this.scene.popMatrix();
    }

    update(t) {
        this.position[1] -= this.speed * t;
    }
}