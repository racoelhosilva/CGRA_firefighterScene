import { CGFappearance, CGFobject } from "../lib/CGF.js";
import { MyCone } from "./MyCone.js";
import { MyPyramid } from "./MyPyramid.js";

export class MyTree extends CGFobject {
  constructor(scene, tilt, tiltAxis, trunkRadius, height, crownColor) {
    super(scene);

    this.tilt = tilt;
    this.tiltAxis = tiltAxis == "x" ? [1, 0, 0] : [0, 0, 1];

    this.trunc = this.buildTrunc(trunkRadius, height);
    this.truncMaterial = this.buildTruncMaterial();
    [this.crown, this.crownStart, this.crownStep] = this.buildCrown(trunkRadius, height);
    this.crownMaterial = this.buildCrownMaterial(crownColor);
  }

  buildTrunc(trunkRadius, height) {
    return new MyCone(this.scene, 32, trunkRadius, height);
  }

  buildTruncMaterial() {
    let material = new CGFappearance(this.scene);
    material.setAmbient(0.2, 0.1, 0.05, 1.0);
    material.setDiffuse(0.5, 0.25, 0.1, 1.0);
    material.setSpecular(0.1, 0.1, 0.1, 1.0);
    material.setShininess(10.0);

    return material;
  }

  buildCrown(trunkRadius, height) {
    let numPyramids = Math.round(height * 0.8 / trunkRadius) - 1;
    let pyramidHeight = height * 1.6 / (numPyramids + 1);

    let crown = [];
    for (let pyramid = 0; pyramid < numPyramids; pyramid++) {
      const pyramidRadius = trunkRadius * (3 - 2 * pyramid / (numPyramids + 1));

      crown.push(new MyPyramid(this.scene, 6, pyramidRadius, pyramidHeight));
    }

    return [crown, height * 0.2, pyramidHeight / 2];
  }

  buildCrownMaterial(crownColor) {
    const [r, g, b] = crownColor;

    let material = new CGFappearance(this.scene);
    material.setAmbient(r * 0.5, g * 0.5, b * 0.5, 1.0);
    material.setDiffuse(r, g, b, 1.0);
    material.setSpecular(r * 0.25, g * 0.25, b * 0.25, 1.0);

    return material;
  }

  display() {
    this.scene.pushMatrix();

    this.scene.rotate(this.tilt, ...this.tiltAxis);
    this.truncMaterial.apply();
    this.trunc.display();

    this.scene.translate(0, this.crownStart, 0);
    this.crownMaterial.apply();
    this.crown.forEach(crownPart => {
      crownPart.display();
      this.scene.translate(0, this.crownStep, 0);
    });

    this.scene.popMatrix();
  }
}