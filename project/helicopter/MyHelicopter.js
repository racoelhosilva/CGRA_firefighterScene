import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MyEllipsoid } from "../component/MyEllipsoid.js";
import { MySkewedPyramid } from "../component/MySkewedPyramid.js";
import { MySkid } from "./MySkid.js";
import { MyRotor } from "./MyRotor.js";
import { MyRudder } from "./MyRudder.js";
import { MyWaterBucket } from "./MyWaterBucket.js";

export class MyHelicopter extends CGFobject {
    MAX_VELOCITY = 0.5;
    MAX_TILT = Math.PI / 4;
    LIFTING_DURATION = 2000;
    LANDING4_DURATION = 2000;

    constructor(scene, cockpitTexture, flyingHeight) {
        super(scene);

        this.initPosition = [0, 0, 0];
        
        this.position = [0, 0, 0];
        this.orientation = -Math.PI / 2;
        this.velocityNorm = 0;
        this.velocity = [0, 0];

        this.flyingHeight = flyingHeight;

        this.tilt = 0;
        this.rotorAngle = 0;
        this.rotorSpeed = 0;

        this.state = "STATIONARY";
        this.animDuration = 0;

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

        this.scene.rotate(this.tilt, 0, 0, 1);

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
        if (this.state === "FLYING") {
            this.orientation += orientationDelta;
            this.velocity[0] = this.velocityNorm * Math.cos(this.orientation);
            this.velocity[1] = -this.velocityNorm * Math.sin(this.orientation);
        }
    }

    accelerate(velocityDelta) {
        if (this.state === "FLYING") {
            this.velocityNorm = Math.min(this.MAX_VELOCITY, Math.max(0, this.velocityNorm + velocityDelta));
            this.velocity[0] = this.velocityNorm * Math.cos(this.orientation);
            this.velocity[1] = -this.velocityNorm * Math.sin(this.orientation);
            
            this.tilt = Math.min(this.MAX_TILT, Math.max(-this.MAX_TILT, this.tilt - velocityDelta * 8));
        }
    }

    liftOff() {
        if (this.state === "STATIONARY") {
            this.state = "LIFTING";
            this.animDuration = 0;
        }
    }
    
    land() {
        if (this.state === "FLYING") {
            this.state = "LANDING3";
            this.animDuration = 0;
            this.position[0] = this.initPosition[0];
            this.position[2] = this.initPosition[2];
            this.velocity = [0, 0];
            this.velocityNorm = 0;

            this.orientation = ((this.orientation + Math.PI) % (2 * Math.PI)) - Math.PI;
            this.initialOrientation = this.orientation;
        }
    }

    update(t) {
        switch (this.state) {
            case "LIFTING":
                this.animDuration += t;
                if (this.animDuration < this.LIFTING_DURATION) {
                    const progressFactor = Math.sin(this.animDuration * Math.PI / (this.LIFTING_DURATION * 2));
                    this.position[1] = this.initPosition[1] + progressFactor * this.flyingHeight;
                    this.rotorSpeed = progressFactor;
                } else {
                    this.state = "FLYING";
                    this.position[1] = this.initPosition[1] + this.flyingHeight;
                    this.rotorSpeed = 1;
                }
                break;

            case "FLYING":
                this.rotorAngle += t;
                this.position[1] = this.initPosition[1] + this.flyingHeight;
                break;

            case "LANDING3":
                this.animDuration += t;

                if (this.animDuration < 1000) {
                    this.orientation += (-Math.PI / 2 - this.initialOrientation) * (t / 1000);
                } else {
                    this.state = "LANDING4";
                    this.orientation = -Math.PI / 2;
                    this.animDuration = 0;
                }
                break;

            case "LANDING4":
                this.animDuration += t;
                if (this.animDuration < this.LIFTING_DURATION) {
                    const progressFactor = Math.sin(this.animDuration * Math.PI / (this.LIFTING_DURATION * 2));
                    this.position[1] = this.initPosition[1] + this.flyingHeight - progressFactor * this.flyingHeight;
                    this.rotorSpeed = 1 - progressFactor;
                } else {
                    this.state = "STATIONARY";
                    this.position[1] = this.initPosition[1];
                    this.rotorSpeed = 0;
                }
        }

        this.position[0] += this.velocity[0] * t;
        this.position[2] += this.velocity[1] * t;
        this.rotorAngle += this.rotorSpeed * t;

        this.tilt *= 0.75;
    }

    reset() {
        this.position = [...this.initPosition];
        this.orientation = -Math.PI / 2;
        this.velocityNorm = 0;
        this.velocity = [0, 0];
        this.tilt = 0;
        this.rotorAngle = 0;
        this.rotorSpeed = 0;
        this.state = "STATIONARY";
    }
}