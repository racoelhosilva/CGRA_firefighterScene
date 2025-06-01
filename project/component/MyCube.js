import { CGFobject } from "../../lib/CGF.js";
import { MyRectangle } from "./MyRectangle.js";

export class MyCube extends CGFobject {
    constructor(scene, size) {
        super(scene);
        this.size = size;

        this.face = new MyRectangle(scene, size, size, false);
    }

    display() {
        // Face in positive zz
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.size);
        this.face.display();
        this.scene.popMatrix();

        // Face in negative zz
        this.scene.pushMatrix();
        this.scene.translate(this.size, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.face.display();
        this.scene.popMatrix();

        // Face in positive xx
        this.scene.pushMatrix();
        this.scene.translate(this.size, 0, this.size);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.face.display();
        this.scene.popMatrix();

        // Face in negative xx
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.face.display();
        this.scene.popMatrix();

        // Face in positive yy
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.face.display();
        this.scene.popMatrix();

        // Face in negative yy
        this.scene.pushMatrix();
        this.scene.translate(0, this.size, 2 * this.size);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, this.size, 0);
        this.face.display();
        this.scene.popMatrix();
    }
}