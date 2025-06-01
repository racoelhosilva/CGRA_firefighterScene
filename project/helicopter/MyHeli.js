import { CGFobject, CGFappearance, CGFscene, CGFtexture } from "../../lib/CGF.js";
import { MyEllipsoid } from "../component/MyEllipsoid.js";
import { MySkewedPyramid } from "../component/MySkewedPyramid.js";
import { MySkid } from "./MySkid.js";
import { MyRotor } from "./MyRotor.js";
import { MyRudder } from "./MyRudder.js";
import { MyWaterBucket } from "./MyWaterBucket.js";

/**
 * @brief Class representing a helicopter in the scene.
 */
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

    /**
     * @brief Creates a helicopter object.
     *
     * @param {CGFscene} scene - The scene to which the helicopter belongs.
     * @param {Array<number>} color - The color of the helicopter.
     * @param {CGFtexture} cockpitTexture - The texture for the cockpit.
     * @param {CGFtexture} metalTexture - The texture for the main metallic parts of the helicopter (tail and rudder).
     * @param {CGFtexture} metalTexture2 - The texture for the details (skids and rotors).
     * @param {number} flyingHeight - The height at which the helicopter flies above the initial position.
     * @param {number} scaleFactor - The scale factor for the helicopter's size.
     */
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

        // Angles that describe the helicopter's instability/turbulence
        this.instabilityAngle1 = 0;
        this.instabilityAngle2 = 0;

        this.state = "STATIONARY";
        this.animDuration = 0;

        this.cockpit = new MyEllipsoid(this.scene, 10, 6, 6, 12, 24);
        this.tail = new MySkewedPyramid(this.scene, 6, 4, 1.5, this.TAIL_LENGTH, 3);

        this.cockpitMaterial = this.buildCockpitMaterial(color);
        this.cockpitMaterial.setTexture(cockpitTexture);

        this.tailMaterial = this.buildTailMaterial(color);
        this.tailMaterial.setTexture(metalTexture);

        this.rudderMaterial = this.buildRudderMaterial(color);
        this.rudderMaterial.setTexture(metalTexture);

        this.detailMaterial = this.buildDetailMaterial();
        this.detailMaterial.setTexture(metalTexture2);

        this.skidRight = new MySkid(this.scene, true, this.detailMaterial);
        this.skidLeft = new MySkid(this.scene, false, this.detailMaterial);

        this.mainRotor = new MyRotor(this.scene, this.MAIN_ROTOR_RADIUS, 5, 1, 2, 0.8, this.detailMaterial);
        this.tailRotor = new MyRotor(this.scene, this.TAIL_ROTOR_RADIUS, 3, 0.7, 0.5, 0.2, this.detailMaterial);
        this.rudder = new MyRudder(this.scene);
        this.waterBucket = new MyWaterBucket(this.scene, 4, 6, 0, this.metalTexture2);

        this.scaleFactor = scaleFactor;
    }

    /**
     * @brief Builds the material for the helicopter cockpit.
     *
     * @param {Array<number>} color - The color of the cockpit, represented as an array of RGB values.
     * @returns {CGFappearance} - The material for the cockpit.
     */
    buildCockpitMaterial(color) {
        let material = new CGFappearance(this.scene);
        material.setAmbient(...color, 1.0);
        material.setDiffuse(...color, 1.0);
        material.setSpecular(...color, 1.0);
        material.setShininess(200.0);

        return material;
    }

    /**
     * @brief Builds the material for the helicopter tail.
     *
     * @param {Array<number>} color - The color of the tail, represented as an array of RGB values.
     * @returns {CGFappearance} - The material for the tail.
     */
    buildTailMaterial(color) {
        let material = new CGFappearance(this.scene);
        material.setAmbient(...color, 1.0);
        material.setDiffuse(...color, 1.0);
        material.setSpecular(...color, 1.0);
        material.setShininess(200.0);

        return material;
    }

    /**
     * @brief Builds the material for the helicopter rudder.
     *
     * @param {Array<number>} color - The color of the rudder, represented as an array of RGB values.
     * @returns {CGFappearance} - The material for the rudder.
     */
    buildRudderMaterial(color) {
        let material = new CGFappearance(this.scene);
        material.setAmbient(...color, 1.0);
        material.setDiffuse(...color, 1.0);
        material.setSpecular(...color, 1.0);
        material.setShininess(200.0);

        return material;
    }

    /**
     * @brief Builds the material for the helicopter's details (skids and rotors).
     *
     * @returns {CGFappearance} - The material for the details.
     */
    buildDetailMaterial() {
        let material = new CGFappearance(this.scene);
        material.setAmbient(0.5, 0.5, 0.5, 1.0);
        material.setDiffuse(0.5, 0.5, 0.5, 1.0);
        material.setSpecular(0.5, 0.5, 0.5, 1.0);
        material.setShininess(200.0);

        return material;
    }

    display() {
        this.scene.pushMatrix();

        // Main transformations
        this.scene.translate(...this.position);
        this.scene.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);
        this.scene.translate(0, this.HELICOPTER_BOTTOM_HEIGHT, 0);
        this.scene.rotate(this.orientation, 0, 1, 0);

        this.scene.pushMatrix();

        // Transformations for the helicopter body (instability angle and tilt)
        this.scene.rotate(this.instabilityAngle2, Math.cos(this.instabilityAngle1), 0, Math.sin(this.instabilityAngle1));
        this.scene.rotate(this.tilt, 0, 0, 1);

        // Cockpit
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.cockpitMaterial.apply();
        this.cockpit.display();
        this.scene.popMatrix();

        // Tail
        this.scene.pushMatrix();
        this.scene.translate(0, 2, 0);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.tailMaterial.apply();
        this.tail.display();
        this.scene.popMatrix();

        // Skids
        this.scene.pushMatrix();
        this.scene.translate(-10, -7, -4);
        this.skidLeft.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-10, -7, 4);
        this.skidRight.display();
        this.scene.popMatrix();

        // Main Rotor
        this.scene.pushMatrix();
        this.scene.translate(0, 5, 0);
        this.scene.rotate(this.rotorAngle, 0, 1, 0);
        this.mainRotor.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-this.TAIL_LENGTH, 5, 0);

        // Rudder and tail rotor
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

        // Water bucket
        if (this.state !== "STATIONARY") {
            this.scene.pushMatrix();
            this.scene.translate(0, -this.bucketHeight, 0);
            this.waterBucket.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }

    /**
     * @brief Sets the initial position of the helicopter (heliport center).
     *
     * @param {Array<number>} initPosition - The initial position of the helicopter, in the format [x, y, z].
     */
    setInitPos(initPosition) {
        for (let i = 0; i < 3; i++)
            this.position[i] += initPosition[i] - this.initPosition[i];
        this.initPosition = initPosition;
        this.waterBucket.setPositionHeight(this.initPosition[1] + this.flyingHeight - this.BUCKET_HEIGHT * this.scaleFactor);
    }

    /**
     * @brief Sets the speed values for the helicopter based on a speed factor.
     *
     * @param {number} speedFactor - The factor by which to scale the helicopter's speed.
     */
    setSpeedValues(speedFactor) {
        this.acceleration = speedFactor / 6000;
        this.orientationVelocity = speedFactor * Math.PI / 30;
        this.maxVelocity = speedFactor * 0.25;
    }

    /**
     * @brief Sets the scale factor for the helicopter.
     *
     * @param {number} scaleFactor - The scale factor to apply to the helicopter's size.
     */
    setScaleFactor(scaleFactor) {
        this.scaleFactor = scaleFactor;
    }

    /**
     * @brief Returns the current state of the helicopter.
     */
    getState() {
        return this.state;
    }

    /**
     * @brief Returns the current move phase of the helicopter.
     * This is used for the heliport's animation.
     *
     * @returns {number} - The move phase: 1 for lifting, 2 for landing and 0 otherwise.
     */
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

    /**
     * @brief Opens the water bucket, if the helicopter is flying and there is water in the bucket.
     */
    openBucket() {
        if (this.state !== "FLYING" || this.waterBucket.getWaterLevel() == 0)
            return;

        if (!this.scene.fires.some(fire => fire.collidesWith([this.position[0], 0, this.position[2]])))
            return;

        this.state = "OPEN";
        this.waterBucket.openBucket();
    }

    /**
     * @brief Checks if the water bucket is empty.
     *
     * @returns {boolean} - True if the water bucket is empty, false otherwise.
     */
    isEmpty() {
        return this.waterBucket.getWaterLevel() == 0;
    }

    /**
     * @brief Turns the helicopter by a specified orientation delta.
     *
     * @param {number} orientationDelta - The angle in radians by which to turn the helicopter.
     */
    turn(orientationDelta) {
        // Normalize between -Math.PI and Math.PI
        this.orientation = -Math.PI + ((this.orientation + Math.PI) + orientationDelta) % (2 * Math.PI);

        this.velocity[0] = this.velocityNorm * Math.cos(this.orientation);
        this.velocity[1] = -this.velocityNorm * Math.sin(this.orientation);
    }

    /**
     * @brief Normalizes a value to be within a specified range.
     *
     * @param {number} value - The value to normalize.
     * @param {number} min - The minimum value of the range.
     * @param {number} max - The maximum value of the range.
     *
     * @returns {number} - The normalized value, clamped between min and max.
     */
    normalize(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    /**
     * @brief Accelerates the helicopter by a specified velocity delta.
     *
     * @param {number} velocityDelta - The change in velocity to apply.
     */
    accelerate(velocityDelta) {
        this.velocityNorm = this.normalize(this.velocityNorm + velocityDelta, 0, this.maxVelocity);
        this.velocity[0] = this.velocityNorm * Math.cos(this.orientation);
        this.velocity[1] = -this.velocityNorm * Math.sin(this.orientation);

        this.tilt = this.normalize(this.tilt - 8 * velocityDelta, -this.MAX_TILT, this.MAX_TILT);
    }

    /**
     * @brief Lifts the helicopter off the heliport or the lake.
     */
    liftOff() {
        if (this.state === "STATIONARY") {
            this.state = "LIFTING";
            this.animDuration = 0;
        } else if (this.state === "LAKE") {
            this.state = "RISING";
            this.animDuration = 0;
        }
    }

    /**
     * @brief Lowers the helicopter to the lake.
     */
    lower() {
        if (this.state === "FLYING" && this.velocityNorm === 0) {
            this.state = "LOWERING";
            this.animDuration = 0;
        }
    }
ground
    /**
     * @brief Lands the helicopter.
     */
    land() {
        if (this.state === "FLYING" && this.isEmpty() && this.velocityNorm === 0) {
            const atStart = this.position[0] !== this.initPosition[0] || this.position[2] !== this.initPosition[2];
            this.state = atStart ? "LANDING1" : "LANDING4";
        }
    }

    /**
     * @brief Returns the distance to the initial position of the helicopter.
     *
     * @param {Array<number>} position - A position, in the format [x, y, z].
     * @return {number} - The distance to the initial position of the helicopter.
     */
    getDistanceToInit(position) {
        let delta = [0, 1, 2].map(i => this.initPosition[i] - position[i]);
        return Math.sqrt(delta[0] * delta[0] + delta[1] * delta[1] + delta[2] * delta[2]);
    }

    /**
     * @brief Returns the next position of the helicopter after moving for a specified time t.
     *
     * @param {number} t - The time in seconds for which to calculate the next position.
     * @returns {Array<number>} - The next position of the helicopter, in the format [x, y, z].
     */
    getNextPosition(t) {
        return [this.position[0] + this.velocity[0] * t, this.position[1], this.position[2] + this.velocity[1] * t];
    }

    /**
     * @brief Interpolates a value between a minimum and maximum based on a factor t.
     *
     * @param {number} t - The interpolation factor, between 0 and 1.
     * @param {number} min - The minimum value of the range.
     * @param {number} max - The maximum value of the range.
     *
     * @returns {number} - The interpolated value.
     */
    interpolate(t, min, max) {
        return min + (max - min) * t;
    }

    /**
     * @brief Updates the helicopter's state, based on the elapsed time since the last update.
     *
     * @param {number} deltaT - The elapsed time in seconds since the last update.
     */
    update(deltaT) {
        switch (this.state) {
            // Lowering the helicopter to the lake
            case "LOWERING":
                this.animDuration += deltaT;
                if (this.animDuration < this.LOWERING_DURATION) {
                    const progressFactor = Math.sin((this.animDuration * Math.PI) / (this.LOWERING_DURATION * 2));
                    this.position[1] = this.interpolate(progressFactor,
                        this.initPosition[1] + this.flyingHeight, this.lakeHeight);
                } else {
                    this.state = "LAKE";
                    this.position[1] = this.lakeHeight;
                }
                break;

            // Rising from the lake
            case "RISING":
                this.animDuration += deltaT;
                if (this.animDuration < this.RISING_DURATION) {
                    const progressFactor = Math.sin((this.animDuration * Math.PI) / (this.RISING_DURATION * 2))
                    this.position[1] = this.interpolate(progressFactor,
                        this.lakeHeight, this.initPosition[1] + this.flyingHeight);
                } else {
                    this.state = "FLYING";
                    this.position[1] = this.initPosition[1] + this.flyingHeight;
                }
                break;

            // Rising from the heliport
            case "LIFTING":
                this.animDuration += deltaT;
                if (this.animDuration < this.LIFTING_DURATION) {
                    const progressFactor = Math.sin(this.animDuration * Math.PI / (this.LIFTING_DURATION * 2));
                    this.position[1] = this.initPosition[1] + progressFactor * this.flyingHeight;
                    this.rotorSpeed = progressFactor * this.MAX_ROTOR_SPEED;
                    this.instabilityAngle2 = this.MAX_ANIMATION2_ANGLE * progressFactor;
                    this.bucketHeight = this.BUCKET_HEIGHT * progressFactor;
                } else {
                    this.state = "FLYING";
                    this.position[1] = this.initPosition[1] + this.flyingHeight;
                    this.rotorSpeed = this.MAX_ROTOR_SPEED;
                    this.instabilityAngle2 = this.MAX_ANIMATION2_ANGLE;
                    this.bucketHeight = this.BUCKET_HEIGHT;
                }
                this.waterBucket.updateCableHeight(this.bucketHeight);
                break;

            // Flying normally
            case "FLYING":
                this.position[1] = this.initPosition[1] + this.flyingHeight;
                break;

            // First phase of automatic landing: turning towards the heliport
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
                        this.accelerate(-this.acceleration * deltaT);

                    if (Math.abs(orientationDelta) > 0.0001) {
                        this.turn(orientationDelta);
                    } else {
                        this.state = "LANDING2";
                        this.orientation = targetOrientation;
                        this.animDuration = 0;
                    }
                }
                break;

            // Second phase of automatic landing: accelerating towards the heliport
            case "LANDING2":
                {
                    this.accelerate(this.acceleration * deltaT);

                    const distance = this.getDistanceToInit(this.position);
                    const nextPos = this.getNextPosition(deltaT);
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

            // Third phase of automatic landing: decelerating towards the heliport
            case "LANDING3":
                {
                    this.accelerate(-this.acceleration * deltaT);

                    const distance = this.getDistanceToInit(this.position);
                    const nextPos = this.getNextPosition(deltaT);

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

            // Fourth phase of automatic landing: turning to the front of the building
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

            // Fifth phase of automatic landing: lowering the helicopter to the heliport
            case "LANDING5":
                this.animDuration += deltaT;
                if (this.animDuration < this.LIFTING_DURATION) {
                    const progressFactor = Math.sin(this.animDuration * Math.PI / (this.LIFTING_DURATION * 2));
                    this.position[1] = this.initPosition[1] + this.flyingHeight - progressFactor * this.flyingHeight;
                    this.rotorSpeed = (1 - progressFactor) * this.MAX_ROTOR_SPEED;
                    this.instabilityAngle2 = this.MAX_ANIMATION2_ANGLE * (1 - progressFactor);
                    this.bucketHeight = this.BUCKET_HEIGHT * (1 - progressFactor);
                } else {
                    this.state = "STATIONARY";
                    this.position[1] = this.initPosition[1];
                    this.rotorSpeed = 0;
                    this.instabilityAngle2 = 0;
                    this.bucketHeight = 0;
                }
                this.waterBucket.updateCableHeight(this.bucketHeight);
                break;

            // Filling the water bucket in a lake
            case "LAKE":
                this.waterBucket.updateWaterLevel(0.001 * deltaT);
                break;

            // Opening the water bucket to extinguish fires
            case "OPEN":
                this.waterBucket.updateParticles(deltaT);

                if (this.waterBucket.getWaterLevel() == 0) {
                    this.waterBucket.closeBucket();
                } else {
                    this.waterBucket.addParticles(3);
                    this.waterBucket.updateWaterLevel(-0.003 * deltaT);
                }

                this.scene.fires.filter(fire => fire.collidesWith([this.position[0], 0, this.position[2]]))
                    .forEach(fire => fire.setHeightFactor(Math.max(0, fire.getHeightFactor() - 0.001 * deltaT)));
                this.scene.fires = this.scene.fires.filter(fire => fire.getHeightFactor() > 0);

                if (this.waterBucket.particles.length == 0) {
                    this.state = "FLYING";
                }
                break;
        }

        this.position = this.getNextPosition(deltaT);
        this.rotorAngle += this.rotorSpeed * deltaT;

        this.tilt *= 0.8;
        this.tiltDiff = 0;
        this.instabilityAngle1 += 0.002 * deltaT;
    }

    /**
     * @brief Resets the helicopter to its initial state.
     */
    reset() {
        this.position = [...this.initPosition];
        this.orientation = -Math.PI / 2;
        this.velocityNorm = 0;
        this.velocity = [0, 0];
        this.tilt = 0;
        this.rotorAngle = 0;
        this.rotorSpeed = 0;
        this.state = "STATIONARY";
        this.instabilityAngle2 = 0;
        this.waterBucket.setWaterLevel(0);
    }

    /**
     * @brief Updates the color of the helicopter's materials.
     *
     * @param {Array<number>} color - The new color of the helicopter, represented as an array of RGB values.
     */
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