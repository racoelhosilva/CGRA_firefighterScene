import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MySphere } from "../component/MySphere.js";

export class MyWaterParticle extends CGFobject {
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

    update(t) {
        this.position[1] -= this.speed * t;
    }
}