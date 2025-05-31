import { CGFappearance, CGFobject } from "../../lib/CGF.js";
import { MyCone } from "../component/MyCone.js";
import { MyPyramid } from "../component/MyPyramid.js";
import { MyRegularPolygon } from "../component/MyRegularPolygon.js";

export class MyTree extends CGFobject {
    crownSides = 6;
    rootHeight = 8;

    constructor(scene, tilt, tiltAxis, trunkRadius, height, crownColor, trunkTexture, crownTexture) {
        super(scene);

        this.tilt = tilt;
        this.tiltAxis = tiltAxis == "x" ? [1, 0, 0] : [0, 0, 1];

        this.trunc = this.buildTrunc(trunkRadius, height);
        this.truncMaterial = this.buildTruncMaterial();
        this.truncMaterial.setTexture(trunkTexture);

        [this.crown, this.crownStart, this.crownStep] = this.buildCrown(trunkRadius, height);
        this.crownBase = new MyRegularPolygon(this.scene, 6, 1);
        this.crownMaterial = this.buildCrownMaterial(crownColor);
        this.crownMaterial.setTexture(crownTexture);
    }

    buildTrunc(trunkRadius, height) {
        const realRadius = (height + this.rootHeight) * trunkRadius / height;
        return new MyCone(this.scene, 8, realRadius, height + this.rootHeight);
    }

    buildTruncMaterial() {
        let material = new CGFappearance(this.scene);
        material.setAmbient(0.306, 0.208, 0.125, 1.0);
        material.setDiffuse(0.306, 0.208, 0.125, 1.0);
        material.setSpecular(0.306, 0.208, 0.125, 1.0);
        material.setShininess(10.0);

        return material;
    }

    buildCrown(trunkRadius, height) {
        let numPyramids = Math.round(height * 0.8 / trunkRadius) - 1;
        let pyramidHeight = height * 1.6 / (numPyramids + 1);

        let crown = [];
        for (let pyramid = 0; pyramid < numPyramids; pyramid++) {
            const pyramidRadius = trunkRadius * (3 - 2 * pyramid / (numPyramids + 1));

            crown.push(new MyPyramid(this.scene, this.crownSides, pyramidRadius, pyramidHeight));
        }

        return [crown, height * 0.2, pyramidHeight / 2];
    }

    buildCrownBase() {
        return new MyRegularPolygon(this.scene, this.crownSides);
    }

    buildCrownMaterial(crownColor) {
        const [r, g, b] = crownColor;

        let material = new CGFappearance(this.scene);
        material.setAmbient(r * 0.75, g * 0.75, b * 0.75, 1.0);
        material.setDiffuse(r, g, b, 1.0);
        material.setSpecular(r * 0.25, g * 0.25, b * 0.25, 1.0);

        return material;
    }

    display() {
        this.scene.pushMatrix();

        this.scene.rotate(this.tilt, ...this.tiltAxis);

        this.scene.pushMatrix();
        this.scene.translate(0, -this.rootHeight, 0);
        this.truncMaterial.apply();
        this.trunc.display();
        this.scene.popMatrix();

        this.scene.translate(0, this.crownStart, 0);
        this.crownMaterial.apply();
        this.crown.forEach(crownPart => {
            crownPart.display();
            this.displayCrownBase(crownPart.radius);
            this.scene.translate(0, this.crownStep, 0);
        });

        this.scene.popMatrix();
    }

    displayCrownBase(radius) {
        this.scene.pushMatrix();
        this.scene.scale(radius, 1, radius);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.crownBase.display();
        this.scene.popMatrix();
    }
}