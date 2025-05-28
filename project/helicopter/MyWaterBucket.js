import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MyCircle } from "../component/MyCircle.js";
import { MyCylinder } from "../component/MyCylinder.js";
import { MyRegularPolygon } from "../component/MyRegularPolygon.js";

export class MyWaterBucket extends CGFobject {
    constructor(scene, radius, height, cableHeight) {
        super(scene);
        this.radius = radius;
        this.height = height;
        this.cableHeight = cableHeight;

        this.bucket = new MyCylinder(this.scene, this.radius, this.height, 8, 2, true);
        this.base = new MyRegularPolygon(this.scene, 8, this.radius, true);
        this.cable = new MyCylinder(this.scene, 0.2, 1, 4, 8);

        this.waterLevel = 0;
        this.maxWaterLevel = height - 1;
        this.water = new MyCircle(this.scene, 8, this.radius - this.scene.Z_CLASHING_OFFSET);

        // Water material
        this.waterMaterial = new CGFappearance(this.scene);
        this.waterMaterial.setAmbient(0.1, 0.1, 0.8, 1.0);
        this.waterMaterial.setDiffuse(0.1, 0.1, 0.8, 1.0);
        this.waterMaterial.setSpecular(0.2, 0.2, 0.8, 1.0);
        this.waterMaterial.setShininess(10);
        
        this.bucketMaterial = new CGFappearance(this.scene);
        this.bucketMaterial.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.bucketMaterial.setDiffuse(0.3, 0.3, 0.3, 1.0);
        this.bucketMaterial.setSpecular(0.8, 0.8, 0.8, 1.0);
        this.bucketMaterial.setShininess(200);

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

        this.scene.pushMatrix();
        this.base.display();
        this.scene.popMatrix();

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
    
        this.scene.popMatrix();
    }

    updateCableHeight(newHeight) {
        this.cableHeight = newHeight;
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
}