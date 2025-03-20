import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyQuad } from "./MyCubeQuad.js";

export class MyUnitCubeQuad extends CGFobject {
  constructor(scene, texture1, texture2, texture3, texture4, texture5, texture6) {
    super(scene);
    this.quad = new MyQuad(scene);
    this.texture1 = texture1; // Top
    this.texture2 = texture2; // Front
    this.texture3 = texture3; // Right
    this.texture4 = texture4; // Back
    this.texture5 = texture5; // Left
    this.texture6 = texture6; // Bottom
    this.material = new CGFappearance(this.scene);
    this.material.setAmbient(1, 1, 1, 1);
    this.material.setDiffuse(1, 1, 1, 1);
    this.material.setSpecular(1, 1, 1, 1);
    this.material.setShininess(1)
  }


  display() {
    // Face in the negative zz side
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 0, 1);
    this.scene.translate(0, 0, -0.5);
    this.material.setTexture(this.texture3);
    this.material.apply();
    this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    this.quad.display();
    this.scene.popMatrix();

    // Face in the positive zz side
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.scene.translate(0, 0, -0.5);
    this.material.setTexture(this.texture5);
    this.material.apply();
    this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    this.quad.display();
    this.scene.popMatrix();

    // Face in the positive yy side
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.scene.translate(0, 0, -0.5);
    this.material.setTexture(this.texture1);
    this.material.apply();
    this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    this.quad.display();
    this.scene.popMatrix();

    // Face in the negative yy side
    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.translate(0, 0, -0.5);
    this.material.setTexture(this.texture6);
    this.material.apply();
    this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    this.quad.display();
    this.scene.popMatrix();

    // Face in the positive xx side
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.scene.rotate(-Math.PI / 2, 0, 1, 0);
    this.scene.translate(0, 0, -0.5);
    this.material.setTexture(this.texture2);
    this.material.apply();
    this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    this.quad.display();
    this.scene.popMatrix();

    // Face in the negative xx side
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.translate(0, 0, -0.5);
    this.material.setTexture(this.texture4);
    this.material.apply();
    this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    this.quad.display();
    this.scene.popMatrix();
  }
}