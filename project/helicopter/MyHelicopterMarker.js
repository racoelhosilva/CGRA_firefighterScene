import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { MyCylinder } from '../component/MyCylinder.js';

export class MyHelicopterMarker extends CGFobject {
  constructor(scene, helicopter, color) {
    super(scene);

    this.helicopter = helicopter;
    this.circle = new MyCylinder(scene, 1, 1000, 10, 1);

    this.material = new CGFappearance(scene);
    this.material.setAmbient(0.0, 0.0, 0.0, 0.0);
    this.material.setDiffuse(0.0, 0.0, 0.0, 0.0);
    this.material.setSpecular(0.0, 0.0, 0.0, 0.0);
    this.material.setEmission(...color, 0.5);
    this.material.setShininess(10.0);
  }

  display() {
    if (this.helicopter.isEmpty())
      return; // Do not display marker if helicopter has no water

    this.material.apply();
    this.scene.pushMatrix();
    this.scene.translate(this.helicopter.position[0], this.helicopter.position[1] - (this.helicopter.bucketHeight) * this.helicopter.scaleFactor, this.helicopter.position[2]);
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.circle.display();
    this.scene.popMatrix();
  }

  updateColor(color) {
    this.material.setEmission(...color, 0.5);
  }
}