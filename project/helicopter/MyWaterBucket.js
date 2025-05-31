import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MyCircle } from "../component/MyCircle.js";
import { MyCylinder } from "../component/MyCylinder.js";
import { MyRegularPolygon } from "../component/MyRegularPolygon.js";
import { MyWaterParticle } from "./MyWaterParticle.js";

export class MyWaterBucket extends CGFobject {
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
        this.particles = [];

        // Water material
        this.waterMaterial = new CGFappearance(this.scene);
        this.waterMaterial.setAmbient(0.173,0.325,0.4, 1.0);
        this.waterMaterial.setDiffuse(0.173,0.325,0.4, 1.0);
        this.waterMaterial.setSpecular(0.173,0.325,0.4, 1.0);
        this.waterMaterial.setShininess(10);
        
        this.bucketMaterial = new CGFappearance(this.scene);
        this.bucketMaterial.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.bucketMaterial.setDiffuse(0.3, 0.3, 0.3, 1.0);
        this.bucketMaterial.setSpecular(0.8, 0.8, 0.8, 1.0);
        this.bucketMaterial.setShininess(200);
        this.bucketMaterial.setTexture(bucketTexture);

        this.cableMaterial = new CGFappearance(this.scene);
        this.cableMaterial.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.cableMaterial.setDiffuse(0.1, 0.1, 0.1, 1.0);
        this.cableMaterial.setSpecular(0.2, 0.2, 0.2, 1.0);
        this.cableMaterial.setShininess(10);
    }

    display() {
        this.scene.pushMatrix();
        this.bucketMaterial.apply();
        this.bucket.display();

        if (this.isOpen) {
            this.scene.pushMatrix();
            this.scene.rotate(Math.PI, 1, 0, 0);
            this.waterMaterial.apply();
            this.water.display();
            this.scene.popMatrix();
        } else {
            this.scene.pushMatrix();
            this.base.display();
            this.scene.popMatrix();
        }

        if (this.waterLevel > 0) {
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

    setPositionHeight(positionHeight) {
        this.positionHeight = positionHeight;
    }

    updateCableHeight(newHeight) {
        this.cableHeight = newHeight;
    }

    openBucket() {
        this.isOpen = true;
    }

    closeBucket() {
        this.isOpen = false;
    }

    getWaterLevel() {
        return this.waterLevel;
    }

    setWaterLevel(level) {
        this.waterLevel = level;
        if (this.waterLevel < 0) {
            this.waterLevel = 0;
        } else if (this.waterLevel > this.maxWaterLevel) {
            this.waterLevel = this.maxWaterLevel;
        }
    }

    updateWaterLevel(diff) {
        this.waterLevel += diff;
        if (this.waterLevel < 0) {
            this.waterLevel = 0;
        } else if (this.waterLevel > this.maxWaterLevel) {
            this.waterLevel = this.maxWaterLevel;
        }
    }

    addParticles(n) {
        for (let i = 0; i < n; i++) {
            const randomDisplacement = Math.random() * this.radius;
            const angle = Math.random() * 2 * Math.PI;
            const randomX = Math.cos(angle) * randomDisplacement;
            const randomZ = Math.sin(angle) * randomDisplacement;
            const randomFactor = Math.random() + 0.5;
            const particle = new MyWaterParticle(this.scene, [randomX, this.positionHeight, randomZ], randomFactor);
            this.particles.push(particle);
        }
    }

    updateParticles(t) {
        for (let particle of this.particles) {
            particle.update(t);
            if (particle.position[1] <= 0) {
                this.particles.splice(this.particles.indexOf(particle), 1);
            }
        }
    }
}