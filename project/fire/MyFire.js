import { CGFappearance, CGFobject } from '../../lib/CGF.js';
import { MyBlaze } from './MyBlaze.js';

export class MyFire extends CGFobject {
  constructor(scene, radius, height, numBlazes, texture) {
    super(scene);

    this.radius = radius;
    this.height = height;
    this.numBlazes = numBlazes;

    this.material = new CGFappearance(this.scene);
    this.material.setAmbient(0.0, 0.0, 0.0, 0.0);
    this.material.setDiffuse(0.0, 0.0, 0.0, 0.0);
    this.material.setSpecular(0.0, 0.0, 0.0, 0.0);
    this.material.setTexture(texture);

    this.blazes = this.buildBlazes();
  }

  buildBlazes() {
    let blazes = [];
    for (let i = 0; i < this.numBlazes; i++) {
      blazes.push(new MyBlaze(this.scene, this.radius, this.height, this.material));
    }
    return blazes;
  }

  display() {
    this.scene.gl.enable(this.scene.gl.BLEND);
    this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
    for (let i = 0; i < this.numBlazes; i++) {
      this.blazes[i].display();
    }
    this.scene.gl.disable(this.scene.gl.BLEND);
  }
}