import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MyEllipsoid } from "../component/MyEllipsoid.js";
import { MySkewedPyramid } from "../component/MySkewedPyramid.js";
import { MySkid } from "./MySkid.js";
import { MyRotor } from "./MyRotor.js";
import { MyRudder } from "./MyRudder.js";

export class MyHelicopter extends CGFobject {
    constructor(scene, cockpitTexture) {
        super(scene);

        this.cockpit = new MyEllipsoid(this.scene, 10, 6, 6, 12, 12);
        this.tail = new MySkewedPyramid(this.scene, 6, 4, 1.5, 32, 3);

        this.cockpitMaterial = new CGFappearance(this.scene);
        this.cockpitMaterial.setAmbient(0.5, 0.0, 0.0, 1.0);
        this.cockpitMaterial.setDiffuse(0.5, 0.0, 0.0, 1.0);
        this.cockpitMaterial.setSpecular(1.0, 0.0, 0.0, 1.0);
        this.cockpitMaterial.setShininess(200);
        this.cockpitMaterial.setTexture(cockpitTexture);

        this.tailMaterial = new CGFappearance(this.scene);
        this.tailMaterial.setAmbient(0.5, 0.0, 0.0, 1.0);
        this.tailMaterial.setDiffuse(0.5, 0.0, 0.0, 1.0);
        this.tailMaterial.setSpecular(1.0, 0.0, 0.0, 1.0);
        this.tailMaterial.setShininess(200);

        this.rudderMaterial = new CGFappearance(this.scene);
        this.rudderMaterial.setAmbient(0.5, 0.0, 0.0, 1.0);
        this.rudderMaterial.setDiffuse(0.5, 0.0, 0.0, 1.0);
        this.rudderMaterial.setSpecular(1.0, 0.0, 0.0, 1.0);
        this.rudderMaterial.setShininess(200);
    
        this.skidRight = new MySkid(this.scene, true);
        this.skidLeft = new MySkid(this.scene, false);

        this.mainRotor = new MyRotor(this.scene, 16, 5, 2, 0.8);
        this.tailRotor = new MyRotor(this.scene, 3, 3, 0.5, 0.2);
        this.rudder = new MyRudder(this.scene);
    }

    display() {
        this.scene.setDefaultAppearance();
        
        this.scene.pushMatrix();
        this.scene.translate(0, 7.4, 0);

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.cockpitMaterial.apply();
        this.cockpit.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 2, 0);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.tailMaterial.apply();
        this.tail.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-10, -7, -4);
        this.scene.setDefaultAppearance();
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
        this.rudderMaterial.apply();
        this.rudder.display();
        this.scene.popMatrix();

        this.scene.popMatrix();

    }
}