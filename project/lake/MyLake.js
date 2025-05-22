import { CGFobject } from "../../lib/CGF.js";
import { MyCircle } from "../component/MyCircle.js";

export class MyLake extends CGFobject {
    constructor(scene, radius, center, material) {
        super(scene);
        this.radius = radius;
        this.center = center;
        this.material = material;

        this.circle = new MyCircle(scene, 32, this.radius);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.center[0], this.center[1], this.center[2]);
        this.material.apply();
        this.circle.display();
        this.scene.popMatrix();
    }
}