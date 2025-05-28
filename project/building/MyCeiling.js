import { CGFappearance, CGFobject } from "../../lib/CGF.js";
import { MyCube } from "../component/MyCube.js";
import { MyRectangle } from "../component/MyRectangle.js";

export class MyCeiling extends CGFobject {
    constructor(scene, width, depth, helipadMaterial) {
        super(scene);
        this.width = width;
        this.depth = depth;
        this.helipadMaterial = helipadMaterial;

        // Ceiling
        this.ceiling = new MyRectangle(this.scene, width, depth);

        // Helipad
        this.helipadSize = 2 * Math.min(width, depth) / 3;
        this.helipadXSpacing = (width - this.helipadSize) / 2;
        this.helipadZSpacing = (depth - this.helipadSize) / 2;
        this.helipad = new MyRectangle(this.scene, this.helipadSize, this.helipadSize);

        // Helipad Light
        this.lightSize = 1;
        this.light = new MyCube(this.scene, this.lightSize);

        // Light Material
        this.lightMaterial = new CGFappearance(this.scene);
        this.lightMaterial.setAmbient(0.7, 0.2, 0.2, 1);
        this.lightMaterial.setDiffuse(0.7, 0.2, 0.2, 1);
        this.lightMaterial.setSpecular(0.7, 0.2, 0.2, 1);
        this.lightMaterial.setEmission(0.1, 0.05, 0.05, 1);
        this.lightMaterial.setShininess(10.0);
    }

    display(helipad) {
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.depth)
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.ceiling.display();
        this.scene.popMatrix();

        if (helipad) {
            this.helipadMaterial.apply();
            this.scene.pushMatrix();
            this.scene.translate(this.helipadXSpacing, this.scene.Z_CLASHING_OFFSET, this.helipadSize + this.helipadZSpacing);
            this.scene.rotate(-Math.PI / 2, 1, 0, 0);
            this.helipad.display();
            this.scene.popMatrix();

            this.lightMaterial.apply();
            this.scene.pushMatrix();
            this.scene.translate(- 0.5 * this.lightSize, 0, 0.5 * this.lightSize);
            for (let i = 0; i < 4; i++) {
                this.scene.pushMatrix();
                this.scene.translate(this.helipadXSpacing + (i % 2) * this.helipadSize, this.scene.Z_CLASHING_OFFSET, this.helipadZSpacing + Math.floor(i / 2) * this.helipadSize);
                this.scene.rotate(-Math.PI / 2, 1, 0, 0);
                this.light.display();
                this.scene.popMatrix();
            }
            this.scene.popMatrix();
        }
    }

    updateSize(width, depth) {
        this.width = width;
        this.depth = depth;
        this.ceiling.updateSize(width, depth);

        this.helipadSize = 2 * Math.min(width, depth) / 3;
        this.helipadXSpacing = (width - this.helipadSize) / 2;
        this.helipadZSpacing = (depth - this.helipadSize) / 2;
        this.helipad.updateSize(this.helipadSize, this.helipadSize);
    }
}