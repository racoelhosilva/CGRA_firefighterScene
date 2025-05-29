import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { MyCylinder } from '../component/MyCylinder.js';

export class MyHelicopterMarker extends CGFobject {
  constructor(scene, helicopter) {
    super(scene);

    this.helicopter = helicopter;
    this.circle = new MyCylinder(scene, 1, 1000, 10, 1);

    this.material = new CGFappearance(scene);
    this.material.setAmbient(0.0, 0.0, 0.0, 0.0);
    this.material.setDiffuse(0.0, 0.0, 0.0, 0.0);
    this.material.setSpecular(0.0, 0.0, 0.0, 0.0);
    this.material.setEmission(0.5, 1.0, 0.5, 0.5);
    this.material.setShininess(10.0);
  }

  display() {
    if (this.helicopter.isEmpty())
      return; // Do not display marker if helicopter has no water

    this.material.apply();
    this.scene.pushMatrix();
    this.scene.translate(this.helicopter.position[0], this.helicopter.position[1] - this.helicopter.bucketHeight + 4, this.helicopter.position[2]);
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.circle.display();
    this.scene.popMatrix();
  }
}