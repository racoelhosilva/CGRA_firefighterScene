import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MyEllipsoid } from "../component/MyEllipsoid.js";
import { MySkewedPyramid } from "../component/MySkewedPyramid.js";
import { MySkid } from "./MySkid.js";
import { MyRotor } from "./MyRotor.js";
import { MyRudder } from "./MyRudder.js";
import { MyWaterBucket } from "./MyWaterBucket.js";

export class MyHeli extends CGFobject {
    MAX_ROTOR_SPEED = 0.015;
    MAX_TILT = Math.PI / 10;
    MAX_ANIMATION2_ANGLE = Math.PI / 36;

    LIFTING_DURATION = 2000;
    LANDING4_DURATION = 2000;
    RISING_DURATION = 2000;
    LOWERING_DURATION = 2000;

    BUCKET_HEIGHT = 24;
    TAIL_LENGTH = 32;
    MAIN_ROTOR_RADIUS = 16;
    TAIL_ROTOR_RADIUS = 3;
    HELICOPTER_BOTTOM_HEIGHT = 7.4;

    constructor(scene, color, cockpitTexture, metalTexture, metalTexture2, flyingHeight, scaleFactor) {
        super(scene);

        this.initPosition = [0, 0, 0];

        this.position = [0, 0, 0];
        this.orientation = -Math.PI / 2;
        this.velocityNorm = 0;
        this.velocity = [0, 0];
        this.setSpeedValues(scene.speedFactor);

        this.flyingHeight = flyingHeight;

        this.bucketHeight = 0;
        this.lakeHeight = this.BUCKET_HEIGHT - 20;

        this.tilt = 0;
        this.rotorAngle = 0;
        this.rotorSpeed = 0;
        this.animationAngle1 = 0;
        this.animationAngle2 = 0;

        this.state = "STATIONARY";
        this.animDuration = 0;

        this.cockpit = new MyEllipsoid(this.scene, 10, 6, 6, 12, 24);
        this.tail = new MySkewedPyramid(this.scene, 6, 4, 1.5, this.TAIL_LENGTH, 3);

        this.cockpitMaterial = new CGFappearance(this.scene);
        this.cockpitMaterial.setAmbient(...color, 1.0);
        this.cockpitMaterial.setDiffuse(...color, 1.0);
        this.cockpitMaterial.setSpecular(...color, 1.0);
        this.cockpitMaterial.setShininess(200.0);
        this.cockpitMaterial.setTexture(cockpitTexture);

        this.tailMaterial = new CGFappearance(this.scene);
        this.tailMaterial.setAmbient(...color, 1.0);
        this.tailMaterial.setDiffuse(...color, 1.0);
        this.tailMaterial.setSpecular(...color, 1.0);
        this.tailMaterial.setShininess(200.0);
        this.tailMaterial.setTexture(metalTexture);

        this.rudderMaterial = new CGFappearance(this.scene);
        this.rudderMaterial.setAmbient(...color, 1.0);
        this.rudderMaterial.setDiffuse(...color, 1.0);
        this.rudderMaterial.setSpecular(...color, 1.0);
        this.rudderMaterial.setShininess(200.0);
        this.rudderMaterial.setTexture(metalTexture);

        this.detailMaterial = new CGFappearance(this.scene);
        this.detailMaterial.setAmbient(0.5, 0.5, 0.5, 1.0);
        this.detailMaterial.setDiffuse(0.5, 0.5, 0.5, 1.0);
        this.detailMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
        this.detailMaterial.setShininess(200.0);
        this.detailMaterial.setTexture(metalTexture2);

        this.skidRight = new MySkid(this.scene, true, this.detailMaterial);
        this.skidLeft = new MySkid(this.scene, false, this.detailMaterial);

        this.mainRotor = new MyRotor(this.scene, this.MAIN_ROTOR_RADIUS, 5, 1, 2, 0.8, this.detailMaterial);
        this.tailRotor = new MyRotor(this.scene, this.TAIL_ROTOR_RADIUS, 3, 0.7, 0.5, 0.2, this.detailMaterial);
        this.rudder = new MyRudder(this.scene);
        this.waterBucket = new MyWaterBucket(this.scene, 4, 6, 0, this.metalTexture2);

        this.scaleFactor = scaleFactor;
    }

    display() {
        this.scene.pushMatrix();

        this.scene.translate(...this.position);
        this.scene.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);
        this.scene.translate(0, this.HELICOPTER_BOTTOM_HEIGHT, 0);
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
        this.scene.translate(-this.TAIL_LENGTH, 5, 0);

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
            this.scene.translate(0, -this.bucketHeight, 0);
            this.waterBucket.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }

    setInitPos(initPosition) {
        for (let i = 0; i < 3; i++)
            this.position[i] += initPosition[i] - this.initPosition[i];
        this.initPosition = initPosition;
        this.waterBucket.setPositionHeight(this.initPosition[1] + this.flyingHeight - this.BUCKET_HEIGHT * this.scaleFactor);
    }

    setSpeedValues(speedFactor) {
        this.acceleration = speedFactor / 6000;
        this.orientationVelocity = speedFactor * Math.PI / 30;
        this.maxVelocity = speedFactor * 0.25;
    }

    setScaleFactor(scaleFactor) {
        this.scaleFactor = scaleFactor;
        this.lakeHeight = this.BUCKET_HEIGHT - 16;
    }

    getState() {
        return this.state;
    }

    getMovePhase() {
        switch (this.state) {
            case "LIFTING":
                return 1;  // UP
            case "LANDING5":
                return 2;  // DOWN
            default:
                return 0;  // H
        }
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
        // Normalize between -Math.PI and Math.PI
        this.orientation = -Math.PI + ((this.orientation + Math.PI) + orientationDelta) % (2 * Math.PI);

        this.velocity[0] = this.velocityNorm * Math.cos(this.orientation);
        this.velocity[1] = -this.velocityNorm * Math.sin(this.orientation);
    }

    normalize(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    accelerate(velocityDelta) {
        this.velocityNorm = this.normalize(this.velocityNorm + velocityDelta, 0, this.maxVelocity);
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
        if (this.state === "FLYING" && this.velocityNorm === 0) {
            this.state = "LOWERING";
            this.animDuration = 0;
        }
    }

    land() {
        if (this.state === "FLYING" && this.isEmpty() && this.velocityNorm === 0) {
            const atStart = this.position[0] !== this.initPosition[0] || this.position[2] !== this.initPosition[2];
            this.state = atStart ? "LANDING1" : "LANDING4";
        }
    }

    getDistanceToInit(position) {
        let delta = [0, 1, 2].map(i => this.initPosition[i] - position[i]);
        return Math.sqrt(delta[0] * delta[0] + delta[1] * delta[1] + delta[2] * delta[2]);
    }

    getNextPosition(t) {
        return [this.position[0] + this.velocity[0] * t, this.position[1], this.position[2] + this.velocity[1] * t];
    }

    interpolate(t, min, max) {
        return min + (max - min) * t;
    }

    update(t) {
        switch (this.state) {
            case "LOWERING":
                this.animDuration += t;
                if (this.animDuration < this.LOWERING_DURATION) {
                    const progressFactor = Math.sin((this.animDuration * Math.PI) / (this.LOWERING_DURATION * 2));
                    this.position[1] = this.interpolate(progressFactor,
                        this.initPosition[1] + this.flyingHeight, this.lakeHeight);
                } else {
                    this.state = "LAKE";
                    this.position[1] = this.lakeHeight;
                }
                break;
            case "RISING":
                this.animDuration += t;
                if (this.animDuration < this.RISING_DURATION) {
                    const progressFactor = Math.sin((this.animDuration * Math.PI) / (this.RISING_DURATION * 2))
                    this.position[1] = this.interpolate(progressFactor,
                        this.lakeHeight, this.initPosition[1] + this.flyingHeight);
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
                    this.rotorSpeed = progressFactor * this.MAX_ROTOR_SPEED;
                    this.animationAngle2 = this.MAX_ANIMATION2_ANGLE * progressFactor;
                    this.bucketHeight = this.BUCKET_HEIGHT * progressFactor;
                } else {
                    this.state = "FLYING";
                    this.position[1] = this.initPosition[1] + this.flyingHeight;
                    this.rotorSpeed = this.MAX_ROTOR_SPEED;
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
                    const targetOrientation = Math.atan2(
                        this.position[2] - this.initPosition[2],
                        this.initPosition[0] - this.position[0]
                    );

                    const orientationDelta = this.orientation <= targetOrientation
                        ? Math.min(this.orientationVelocity, targetOrientation - this.orientation)
                        : Math.max(-this.orientationVelocity, targetOrientation - this.orientation);

                    if (this.velocityNorm > 0)
                        this.accelerate(-this.acceleration * t);

                    if (Math.abs(orientationDelta) > 0.0001) {
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
                    this.accelerate(this.acceleration * t);

                    const distance = this.getDistanceToInit(this.position);
                    const nextPos = this.getNextPosition(t);
                    const nextDistance = this.getDistanceToInit(nextPos);
                    const toleranceDistance = this.velocityNorm * this.velocityNorm / 2 / this.acceleration;

                    if (nextDistance < toleranceDistance) {
                        this.state = "LANDING3";
                        break;
                    }

                    if (nextDistance >= distance) {
                        this.state = "LANDING4";
                        this.position[0] = this.initPosition[0];
                        this.position[2] = this.initPosition[2];
                        this.velocity = [0, 0];
                        this.velocityNorm = 0;
                        break;
                    }
                }
                break;

            case "LANDING3":
                {
                    this.accelerate(-this.acceleration * t);

                    const distance = this.getDistanceToInit(this.position);
                    const nextPos = this.getNextPosition(t);

                    if (this.getDistanceToInit(nextPos) >= distance) {
                        this.state = "LANDING4";
                        this.position[0] = this.initPosition[0];
                        this.position[2] = this.initPosition[2];
                        this.velocity = [0, 0];
                        this.velocityNorm = 0;
                        break;
                    }
                }
                break;

            case "LANDING4":
                {
                    const targetOrientation = -Math.PI / 2;
                    const orientationDelta = this.orientation <= targetOrientation
                        ? Math.min(this.orientationVelocity, targetOrientation - this.orientation)
                        : Math.max(-this.orientationVelocity, targetOrientation - this.orientation);

                    if (Math.abs(orientationDelta) > 0.0001) {
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
                    this.rotorSpeed = (1 - progressFactor) * this.MAX_ROTOR_SPEED;
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
                this.scene.fires = this.scene.fires.filter(fire => fire.getHeightFactor() > 0);

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

    updateColor(color) {
        this.cockpitMaterial.setAmbient(...color, 1.0);
        this.cockpitMaterial.setDiffuse(...color, 1.0);
        this.cockpitMaterial.setSpecular(...color, 1.0);
        this.tailMaterial.setAmbient(...color, 1.0);
        this.tailMaterial.setDiffuse(...color, 1.0);
        this.tailMaterial.setSpecular(...color, 1.0);
        this.rudderMaterial.setAmbient(...color, 1.0);
        this.rudderMaterial.setDiffuse(...color, 1.0);
        this.rudderMaterial.setSpecular(...color, 1.0);
    }
}