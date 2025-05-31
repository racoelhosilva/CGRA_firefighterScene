import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MyEllipsoid } from "../component/MyEllipsoid.js";
import { MySkewedPyramid } from "../component/MySkewedPyramid.js";
import { MySkid } from "./MySkid.js";
import { MyRotor } from "./MyRotor.js";
import { MyRudder } from "./MyRudder.js";
import { MyWaterBucket } from "./MyWaterBucket.js";

export class MyHelicopter extends CGFobject {
    MAX_VELOCITY = 0.25;
    MAX_TILT = Math.PI / 10;
    LIFTING_DURATION = 2000;
    LANDING4_DURATION = 2000;
    RISING_DURATION = 2000;
    LOWERING_DURATION = 2000;
    BUCKET_HEIGHT = 24;
    MAX_ANIMATION2_ANGLE = Math.PI / 36;

    constructor(scene, cockpitTexture, metalTexture, metalTexture2, flyingHeight) {
        super(scene);

        this.initPosition = [0, 0, 0];

        this.position = [0, 0, 0];
        this.orientation = -Math.PI / 2;
        this.velocityNorm = 0;
        this.velocity = [0, 0];
        this.acceleration = scene.speedFactor / 6000;
        this.orientationVelocity = scene.speedFactor * Math.PI / 30;

        this.flyingHeight = flyingHeight;

        this.bucketHeight = 0;
        this.lakeHeight = this.BUCKET_HEIGHT - 14;

        this.tilt = 0;
        this.rotorAngle = 0;
        this.rotorSpeed = 0;
        this.animationAngle1 = 0;
        this.animationAngle2 = 0;

        this.state = "STATIONARY";
        this.animDuration = 0;

        this.cockpit = new MyEllipsoid(this.scene, 10, 6, 6, 12, 12);
        this.tail = new MySkewedPyramid(this.scene, 6, 4, 1.5, 32, 3);

        this.cockpitMaterial = new CGFappearance(this.scene);
        this.cockpitMaterial.setAmbient(0.627, 0.0, 0.0, 1.0);
        this.cockpitMaterial.setDiffuse(0.627, 0.0, 0.0, 1.0);
        this.cockpitMaterial.setSpecular(0.627, 0.0, 0.0, 1.0);
        this.cockpitMaterial.setShininess(200);
        this.cockpitMaterial.setTexture(cockpitTexture);

        this.tailMaterial = new CGFappearance(this.scene);
        this.tailMaterial.setAmbient(0.627, 0.0, 0.0, 1.0);
        this.tailMaterial.setDiffuse(0.627, 0.0, 0.0, 1.0);
        this.tailMaterial.setSpecular(0.627, 0.0, 0.0, 1.0);
        this.tailMaterial.setShininess(200);
        this.tailMaterial.setTexture(metalTexture);

        this.rudderMaterial = new CGFappearance(this.scene);
        this.rudderMaterial.setAmbient(0.627, 0.0, 0.0, 1.0);
        this.rudderMaterial.setDiffuse(0.627, 0.0, 0.0, 1.0);
        this.rudderMaterial.setSpecular(0.627, 0.0, 0.0, 1.0);
        this.rudderMaterial.setShininess(200);
        this.rudderMaterial.setTexture(metalTexture);

        this.detailMaterial = new CGFappearance(this.scene);
        this.detailMaterial.setAmbient(0.5, 0.5, 0.5, 1.0);
        this.detailMaterial.setDiffuse(0.5, 0.5, 0.5, 1.0);
        this.detailMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
        this.detailMaterial.setShininess(10.0);
        this.detailMaterial.setTexture(metalTexture2);

        this.skidRight = new MySkid(this.scene, true, this.detailMaterial);
        this.skidLeft = new MySkid(this.scene, false, this.detailMaterial);

        this.mainRotor = new MyRotor(this.scene, 16, 5, 1, 2, 0.8, this.detailMaterial);
        this.tailRotor = new MyRotor(this.scene, 3, 3, 0.7, 0.5, 0.2, this.detailMaterial);
        this.rudder = new MyRudder(this.scene);
        this.waterBucket = new MyWaterBucket(this.scene, 4, 6, 0, this.metalTexture2);
    }

    display() {
        this.scene.pushMatrix();

        this.scene.translate(0, 7.4, 0);
        this.scene.translate(...this.position);

        this.scene.rotate(this.orientation, 0, 1, 0);

        this.scene.pushMatrix();

        this.scene.rotate(this.animationAngle2, Math.cos(this.animationAngle1), 0, Math.sin(this.animationAngle1));
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

        if (this.state !== "STATIONARY") {
            this.scene.pushMatrix();
            this.scene.translate(0, -4 - this.bucketHeight, 0);
            this.waterBucket.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }

    setInitPos(initPosition) {
        for (let i = 0; i < 3; i++)
            this.position[i] += initPosition[i] - this.initPosition[i];
        this.initPosition = initPosition;
        this.waterBucket.setPositionHeight(this.initPosition[1] + this.flyingHeight - this.BUCKET_HEIGHT - 4);
    }

    getState() {
        return this.state;
    }

    getMovePhase() {
        if (this.state == "LIFTING") { // up
            return 1;
        } else if (this.state == "LANDING5") { // down
            return 2;
        } else {
            return 0;
        }
    }

    isOverLake(center, radius) {
        const dx = this.position[0] - center[0];
        const dz = this.position[2] - center[2];
        return (this.velocity[0] == 0 && this.velocity[1] == 0) && (dx * dx + dz * dz) <= (radius * radius);
    }

    openBucket() {
        if (this.state !== "FLYING" || this.waterBucket.getWaterLevel() == 0)
            return;

        if (!this.scene.fires.some(fire => fire.collidesWith([this.position[0], 0, this.position[2]])))
            return;

        this.state = "OPEN";
        this.waterBucket.openBucket();
    }

    isEmpty() {
        return this.waterBucket.getWaterLevel() == 0;
    }

    turn(orientationDelta) {
        this.orientation += orientationDelta;
        this.velocity[0] = this.velocityNorm * Math.cos(this.orientation);
        this.velocity[1] = -this.velocityNorm * Math.sin(this.orientation);
    }

    normalize(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    accelerate(velocityDelta) {
        this.velocityNorm = this.normalize(this.velocityNorm + velocityDelta, 0, this.MAX_VELOCITY);
        this.velocity[0] = this.velocityNorm * Math.cos(this.orientation);
        this.velocity[1] = -this.velocityNorm * Math.sin(this.orientation);

        this.tilt = this.normalize(this.tilt - 8 * velocityDelta, -this.MAX_TILT, this.MAX_TILT);
    }

    liftOff() {
        if (this.state === "STATIONARY") {
            this.state = "LIFTING";
            this.animDuration = 0;
        } else if (this.state === "LAKE") {
            this.state = "RISING";
            this.animDuration = 0;
        }
    }

    lower() {
        if (this.state === "FLYING") {
            this.state = "LOWERING";
            this.animDuration = 0;
        }
    }

    land() {
        if (this.state === "FLYING" && this.isEmpty()) {
            const atStart = this.position[0] !== this.initPosition[0] || this.position[2] !== this.initPosition[2];
            this.state = atStart ? "LANDING1" : "LANDING4";

            // Normalize the orientation to be between -PI and PI
            this.orientation = ((this.orientation + Math.PI) % (2 * Math.PI)) - Math.PI;
        }
    }

    getDistanceToInit(position) {
        let delta = [0, 1, 2].map(i => this.initPosition[i] - position[i]);
        return Math.sqrt(delta[0] * delta[0] + delta[1] * delta[1] + delta[2] * delta[2]);
    }

    getNextPosition(t) {
        return [this.position[0] + this.velocity[0] * t, this.position[1], this.position[2] + this.velocity[1] * t];
    }

    update(t) {
        switch (this.state) {
            case "LOWERING":
                this.animDuration += t;
                if (this.animDuration < this.LOWERING_DURATION) {
                    const progressFactor = Math.sin((this.animDuration * Math.PI) / (this.LOWERING_DURATION * 2));
                    this.position[1] = (this.initPosition[1] + this.flyingHeight) - progressFactor * (this.flyingHeight + this.initPosition[1] - this.lakeHeight);
                } else {
                    this.state = "LAKE";
                    this.position[1] = this.lakeHeight;
                }
                break;
            case "RISING":
                this.animDuration += t;
                if (this.animDuration < this.RISING_DURATION) {
                    const progressFactor = Math.sin((this.animDuration * Math.PI) / (this.RISING_DURATION * 2))
                    this.position[1] = this.lakeHeight + progressFactor * (this.flyingHeight + this.initPosition[1] - this.lakeHeight);
                } else {
                    this.state = "FLYING";
                    this.position[1] = this.initPosition[1] + this.flyingHeight;
                }
                break;
            case "LIFTING":
                this.animDuration += t;
                if (this.animDuration < this.LIFTING_DURATION) {
                    const progressFactor = Math.sin(this.animDuration * Math.PI / (this.LIFTING_DURATION * 2));
                    this.position[1] = this.initPosition[1] + progressFactor * this.flyingHeight;
                    this.rotorSpeed = progressFactor;
                    this.animationAngle2 = this.MAX_ANIMATION2_ANGLE * progressFactor;
                    this.bucketHeight = this.BUCKET_HEIGHT * progressFactor;
                } else {
                    this.state = "FLYING";
                    this.position[1] = this.initPosition[1] + this.flyingHeight;
                    this.rotorSpeed = 1;
                    this.animationAngle2 = this.MAX_ANIMATION2_ANGLE;
                    this.bucketHeight = this.BUCKET_HEIGHT;
                }
                this.waterBucket.updateCableHeight(this.bucketHeight);
                break;

            case "FLYING":
                this.position[1] = this.initPosition[1] + this.flyingHeight;
                break;

            case "LANDING1":
                {
                    const targetOrientation = Math.atan2(this.position[2] - this.initPosition[2], this.initPosition[0] - this.position[0]);
                    const orientationDelta = this.orientation <= targetOrientation
                        ? Math.min(this.orientationVelocity, targetOrientation - this.orientation)
                        : Math.max(-this.orientationVelocity, targetOrientation - this.orientation);

                    if (this.velocityNorm > 0)
                        this.accelerate(-this.acceleration * t);

                    if (orientationDelta !== 0) {
                        this.turn(orientationDelta);
                    } else {
                        this.state = "LANDING2";
                        this.orientation = targetOrientation;
                        this.animDuration = 0;
                    }
                }
                break;

            case "LANDING2":
                {
                    const toleranceDistance = this.velocityNorm * this.velocityNorm / 2 / this.acceleration;

                    if (this.getDistanceToInit(this.position) < toleranceDistance) {
                        this.state = "LANDING3";
                        break;
                    }

                    this.accelerate(this.acceleration * t);
                }
                break;

            case "LANDING3":
                {
                    const distance = this.getDistanceToInit(this.position);
                    const nextPos = this.getNextPosition(t);

                    if (this.getDistanceToInit(nextPos) > distance) {
                        this.state = "LANDING4";
                        this.position[0] = this.initPosition[0];
                        this.position[2] = this.initPosition[2];
                        this.velocity = [0, 0];
                        this.velocityNorm = 0;
                        break;
                    }

                    this.accelerate(-this.acceleration * t);
                }
                break;

            case "LANDING4":
                {
                    const targetOrientation = -Math.PI / 2;
                    const orientationDelta = this.orientation <= targetOrientation
                        ? Math.min(this.orientationVelocity, targetOrientation - this.orientation)
                        : Math.max(-this.orientationVelocity, targetOrientation - this.orientation);

                    if (orientationDelta !== 0) {
                        this.turn(orientationDelta);
                    } else {
                        this.state = "LANDING5";
                        this.orientation = targetOrientation;
                        this.animDuration = 0;
                    }
                }
                break;

            case "LANDING5":
                this.animDuration += t;
                if (this.animDuration < this.LIFTING_DURATION) {
                    const progressFactor = Math.sin(this.animDuration * Math.PI / (this.LIFTING_DURATION * 2));
                    this.position[1] = this.initPosition[1] + this.flyingHeight - progressFactor * this.flyingHeight;
                    this.rotorSpeed = 1 - progressFactor;
                    this.animationAngle2 = this.MAX_ANIMATION2_ANGLE * (1 - progressFactor);
                    this.bucketHeight = this.BUCKET_HEIGHT * (1 - progressFactor);
                } else {
                    this.state = "STATIONARY";
                    this.position[1] = this.initPosition[1];
                    this.rotorSpeed = 0;
                    this.animationAngle2 = 0;
                    this.bucketHeight = 0;
                }
                this.waterBucket.updateCableHeight(this.bucketHeight);
                break;

            case "LAKE":
                this.waterBucket.updateWaterLevel(0.001 * t);
                break;

            case "OPEN":
                this.waterBucket.updateParticles(t);

                if (this.waterBucket.getWaterLevel() == 0) {
                    this.waterBucket.closeBucket();
                } else {
                    this.waterBucket.addParticles(3);
                    this.waterBucket.updateWaterLevel(-0.003 * t);
                }

                this.scene.fires.filter(fire => fire.collidesWith([this.position[0], 0, this.position[2]]))
                    .forEach(fire => fire.setHeightFactor(Math.max(0, fire.getHeightFactor() - 0.001 * t)));

                if (this.waterBucket.particles.length == 0) {
                    this.state = "FLYING";
                }
                break;
        }

        this.position = this.getNextPosition(t);
        this.rotorAngle += this.rotorSpeed * t;

        this.tilt *= 0.8;
        this.tiltDiff = 0;
        this.animationAngle1 += 0.002 * t;
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
        this.animationAngle2 = 0;
        this.waterBucket.setWaterLevel(0);
    }
}