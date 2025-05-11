import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MyEllipsoid } from "../component/MyEllipsoid.js";
import { MySkewedPyramid } from "../component/MySkewedPyramid.js";
import { MySkid } from "./MySkid.js";
import { MyRotor } from "./MyRotor.js";
import { MyRudder } from "./MyRudder.js";
import { MyWaterBucket } from "./MyWaterBucket.js";

export class MyHelicopter extends CGFobject {
    MAX_VELOCITY = 0.5;

    constructor(scene, cockpitTexture) {
        super(scene);

        this.initPosition = [0, 0, 0];
        this.rotorAngle = 0;
        
        this.position = [0, 0, 0];
        this.orientation = -Math.PI / 2;
        this.velocityNorm = 0;
        this.velocity = [0, 0, 0];

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
        this.waterBucket = new MyWaterBucket(this.scene, 4, 6);
    }

    display() {        
        this.scene.pushMatrix();
        
        this.scene.translate(0, 7.4, 0);
        this.scene.translate(...this.position);

        this.scene.rotate(this.orientation, 0, 1, 0);

        this.scene.pushMatrix();

        //this.scene.rotate(Math.PI / 12, 0, 0, 1);

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
        this.skidLeft.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-10, -7, 4);
        this.skidRight.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 5, 0);
        this.scene.rotate(this.rotorAngle, 0, 1, 0);
        this.mainRotor.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-32, 5, 0);

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.rotate(this.rotorAngle, 0, 1, 0);
        this.tailRotor.display();
        this.scene.popMatrix();
        
        this.scene.translate(1, 0, 0);
        this.rudderMaterial.apply();
        this.rudder.display();
        this.scene.popMatrix();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -24, 0);
        this.waterBucket.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }

    setInitPos(initPosition) {
        for (let i = 0; i < 3; i++)
            this.position[i] += initPosition[i] - this.initPosition[i];
        this.initPosition = initPosition;
    }

    turn(orientationDelta) {
        this.orientation += orientationDelta;
        this.velocity[0] = this.velocityNorm * Math.cos(this.orientation);
        this.velocity[2] = -this.velocityNorm * Math.sin(this.orientation);
    }

    accelerate(velocityDelta) {
        this.velocityNorm = Math.min(this.MAX_VELOCITY, Math.max(0, this.velocityNorm + velocityDelta));
        this.velocity[0] = this.velocityNorm * Math.cos(this.orientation);
        this.velocity[2] = -this.velocityNorm * Math.sin(this.orientation);
    }

    update(t) {
        this.rotorAngle += t;
        this.position[0] += this.velocity[0] * t;
        this.position[1] += this.velocity[1] * t;
        this.position[2] += this.velocity[2] * t;
    }
}