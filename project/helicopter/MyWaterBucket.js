import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MyCylinder } from "../component/MyCylinder.js";
import { MyRegularPolygon } from "../component/MyRegularPolygon.js";

export class MyWaterBucket extends CGFobject {
    constructor(scene, radius, height) {
        super(scene);
        this.radius = radius;
        this.height = height;

        this.bucket = new MyCylinder(this.scene, this.radius, this.height, 8, 2, true);
        this.base = new MyRegularPolygon(this.scene, 8, this.radius, true);
        this.cable = new MyCylinder(this.scene, 0.2, 24 + this.radius, 4, 8);
        
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
        
        this.cableMaterial.apply();
        this.cable.display();
    
        this.scene.popMatrix();
    }
}