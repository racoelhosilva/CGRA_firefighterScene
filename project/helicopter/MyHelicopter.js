import { CGFobject } from "../../lib/CGF.js";
import { MyEllipsoid } from "../component/MyEllipsoid.js";
import { MySkewedPyramid } from "../component/MySkewedPyramid.js";
import { MySkid } from "./MySkid.js";
import { MyRotor } from "./MyRotor.js";
import { MyRudder } from "./MyRudder.js";

export class MyHelicopter extends CGFobject {
    constructor(scene) {
        super(scene);

        this.body = new MyEllipsoid(this.scene, 10, 6, 6, 12, 8);
        this.tail = new MySkewedPyramid(this.scene, 6, 4, 1.5, 32, 3);
    
        this.skidRight = new MySkid(this.scene, true);
        this.skidLeft = new MySkid(this.scene, false);

        this.mainRotor = new MyRotor(this.scene, 16, 5, 2, 0.8);
        this.tailRotor = new MyRotor(this.scene, 3, 3, 0.5, 0.2);
        this.rudder = new MyRudder(this.scene);
    }

    display() {
        this.scene.setDefaultAppearance();
        
        this.scene.pushMatrix();
        this.scene.translate(0, 40, 0);
        
        this.body.display();

        this.scene.pushMatrix();
        this.scene.translate(0, 2, 0);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.tail.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-10, -7, -4);
        this.skidLeft.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-10, -7, 4);
        this.skidRight.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 5, 0);
        this.mainRotor.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-32, 5, 0);

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.tailRotor.display();
        this.scene.popMatrix();
        
        this.scene.translate(1, 0, 0);
        this.rudder.display();
        this.scene.popMatrix();

        this.scene.popMatrix();

    }
}