import { CGFobject } from "../lib/CGF.js";
import { MyQuad } from "./MyQuad.js";

export class MyUnitCubeQuad extends CGFobject {
  constructor(scene) {
    super(scene);
    this.quad = new MyQuad(scene);
  }


  display() {
    // Face in the negative zz side
    this.scene.pushMatrix();
    this.scene.translate(0, 0, -0.5);
    this.quad.display();
    this.scene.popMatrix();

    // Face in the positive zz side
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.scene.translate(0, 0, -0.5);
    this.quad.display();
    this.scene.popMatrix();

    // Face in the positive yy side
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.scene.translate(0, 0, -0.5);
    this.quad.display();
    this.scene.popMatrix();

    // Face in the negative yy side
    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.translate(0, 0, -0.5);
    this.quad.display();
    this.scene.popMatrix();

    // Face in the positive xx side
    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.scene.translate(0, 0, -0.5);
    this.quad.display();
    this.scene.popMatrix();

    // Face in the negative xx side
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.translate(0, 0, -0.5);
    this.quad.display();
    this.scene.popMatrix();
  }
}