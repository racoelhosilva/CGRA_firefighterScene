import { CGFobject, CGFappearance, CGFscene, CGFtexture } from "../../lib/CGF.js";
import { MyCircle } from "../component/MyCircle.js";
import { MyCylinder } from "../component/MyCylinder.js";
import { MyRegularPolygon } from "../component/MyRegularPolygon.js";
import { MyWaterParticle } from "./MyWaterParticle.js";

/**
 * @brief Class representing the helicopter's water bucket.
 */
export class MyWaterBucket extends CGFobject {
    /**
     * @brief Creates a new water bucket object
     *
     * @param {CGFscene} scene - The scene to which the bucket belongs.
     * @param {number} radius - The radius of the bucket.
     * @param {number} height - The height of the bucket.
     * @param {number} cableHeight - The height of the cable connecting the bucket.
     * @param {CGFtexture} bucketTexture - The texture to apply to the bucket.
     */
    constructor(scene, radius, height, cableHeight, bucketTexture) {
        super(scene);
        this.radius = radius;
        this.height = height;
        this.cableHeight = cableHeight;
        this.isOpen = false;
        this.positionHeight = 0;

        this.bucket = new MyCylinder(this.scene, this.radius, this.height, 8, 2, true);
        this.base = new MyRegularPolygon(this.scene, 8, this.radius, true);
        this.cable = new MyCylinder(this.scene, 0.2, 1, 4, 8);

        this.waterLevel = 0;
        this.maxWaterLevel = height - 1;
        this.water = new MyCircle(this.scene, 8, this.radius - this.scene.Z_CLASHING_OFFSET);
        this.particles = [];  // Used in the water dropping animation

        this.waterMaterial = this.buildWaterMaterial();
        this.bucketMaterial = this.buildBucketMaterial(bucketTexture);
        this.cableMaterial = this.buildCableMaterial();
    }

    /**
     * @brief Builds the water material used for rendering the water in the bucket.
     *
     * @returns {CGFappearance} - The water material with appropriate properties.
     */
    buildWaterMaterial() {
        let waterMaterial = new CGFappearance(this.scene);
        waterMaterial.setAmbient(0.173, 0.325, 0.4, 1.0);
        waterMaterial.setDiffuse(0.173, 0.325, 0.4, 1.0);
        waterMaterial.setSpecular(0.173, 0.325, 0.4, 1.0);
        waterMaterial.setShininess(10.0);

        return waterMaterial;
    }

    /**
     * @brief Builds the bucket material used for rendering the bucket.
     *
     * @param {CGFtexture} bucketTexture - The texture to apply to the bucket.
     * @return {CGFappearance} - The bucket material with appropriate properties.
     * */
    buildBucketMaterial(bucketTexture) {
        let bucketMaterial = new CGFappearance(this.scene);
        bucketMaterial.setAmbient(0.3, 0.3, 0.3, 1.0);
        bucketMaterial.setDiffuse(0.3, 0.3, 0.3, 1.0);
        bucketMaterial.setSpecular(0.8, 0.8, 0.8, 1.0);
        bucketMaterial.setShininess(200.0);
        bucketMaterial.setTexture(bucketTexture);

        return bucketMaterial;
    }

    /**
     * @brief Builds the cable material used for rendering the cable connecting the bucket.
     *
     * @return {CGFappearance} - The cable material with appropriate properties.
     */
    buildCableMaterial() {
        let cableMaterial = new CGFappearance(this.scene);
        cableMaterial.setAmbient(0.1, 0.1, 0.1, 1.0);
        cableMaterial.setDiffuse(0.1, 0.1, 0.1, 1.0);
        cableMaterial.setSpecular(0.2, 0.2, 0.2, 1.0);
        cableMaterial.setShininess(10.0);

        return cableMaterial;
    }

    display() {
        this.scene.pushMatrix();
        this.bucketMaterial.apply();
        this.bucket.display();

        if (this.isOpen) {
            // Draw bottom portion of water if open
            this.scene.pushMatrix();
            this.scene.rotate(Math.PI, 1, 0, 0);
            this.waterMaterial.apply();
            this.water.display();
            this.scene.popMatrix();
        } else {
            // Draw base of the bucket if closed
            this.scene.pushMatrix();
            this.base.display();
            this.scene.popMatrix();
        }

        if (this.waterLevel > 0) {
            // Draw water surface level
            this.scene.pushMatrix();
            this.scene.translate(0, this.waterLevel, 0);
            this.waterMaterial.apply();
            this.water.display();
            this.scene.popMatrix();
        }

        this.scene.pushMatrix();
        this.scene.scale(1, this.cableHeight, 1);
        this.cableMaterial.apply();
        this.cable.display();
        this.scene.popMatrix();

        this.waterMaterial.apply();
        for (let particle of this.particles) {
            this.scene.pushMatrix();
            this.scene.translate(particle.position[0], particle.position[1] - this.positionHeight, particle.position[2]);
            particle.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }

    /**
     * @brief Sets the height of the bucket's position.
     *
     * @param {number} positionHeight - The height at which the bucket is positioned.
     */
    setPositionHeight(positionHeight) {
        this.positionHeight = positionHeight;
    }

    /**
     * @brief Updates the height of the cable connecting the bucket.
     *
     * @param {number} newHeight - The new height of the cable.
     */
    updateCableHeight(newHeight) {
        this.cableHeight = newHeight;
    }

    /**
     * @brief Opens the bucket.
     */
    openBucket() {
        this.isOpen = true;
    }

    /**
     * @brief Closes the bucket.
     */
    closeBucket() {
        this.isOpen = false;
    }

    /**
     * @brief Returns the current water level in the bucket.
     */
    getWaterLevel() {
        return this.waterLevel;
    }

    /**
     * @brief Sets the water level in the bucket.
     *
     * @param {number} level
     */
    setWaterLevel(level) {
        this.waterLevel = Math.max(0, Math.min(this.maxWaterLevel, level));
    }

    /**
     * @brief Updates the water level in the bucket by a specified difference.
     *
     * @param {number} diff
     */
    updateWaterLevel(diff) {
        this.setWaterLevel(this.waterLevel + diff);
    }

    /**
     * @brief Adds a specified number of random water particles to particle buffer.
     *
     * @param {number} numParticles - The number of particles to add.
     */
    addParticles(numParticles) {
        for (let i = 0; i < numParticles; i++) {
            const randomDisplacement = Math.random() * this.radius;
            const angle = Math.random() * 2 * Math.PI;
            const randomX = Math.cos(angle) * randomDisplacement;
            const randomZ = Math.sin(angle) * randomDisplacement;
            const randomFactor = Math.random() + 0.5;
            const particle = new MyWaterParticle(this.scene, [randomX, this.positionHeight, randomZ], randomFactor);
            this.particles.push(particle);
        }
    }

    /**
     * @brief Updates the particles in the bucket.
     *
     * @param {number} deltaT - The time elapsed since the last update.
     */
    updateParticles(deltaT) {
        for (let i = 0; i < this.particles.length; ) {
            let particle = this.particles[i];
            particle.update(deltaT);
            if (particle.position[1] <= 0) {
                this.particles.splice(this.particles.indexOf(particle), 1);
            } else {
                i++;
            }
        }
    }
}