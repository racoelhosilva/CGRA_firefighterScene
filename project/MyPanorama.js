import { CGFappearance, CGFobject } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";

export class MyPanorama extends CGFobject {
  constructor(scene, stacks, slices, texture) {
    super(scene);

    this.sphere = new MySphere(scene, stacks, slices, true);
    this.material = new CGFappearance(scene);
    this.material.setEmission(1.0, 1.0, 1.0, 1.0);
    this.material.setTexture(texture);
  }

  display() {
    this.scene.pushMatrix();
    this.scene.translate(...this.scene.camera.position);
    this.scene.scale(400, 400, 400);

    this.material.apply();
    this.sphere.display();
    this.scene.setDefaultAppearance();

    this.scene.popMatrix();
  }
}