import { CGFappearance, CGFobject } from '../../lib/CGF.js';
import { MyBlaze } from './MyBlaze.js';

export class MyFire extends CGFobject {
  constructor(scene, radius, height, numBlazes, center, texture) {
    super(scene);

    this.radius = radius;
    this.height = height;
    this.center = center;
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
    this.scene.pushMatrix();
    this.scene.translate(this.center[0], this.center[1], this.center[2]);

    this.scene.gl.enable(this.scene.gl.BLEND);
    this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);


    for (let i = 0; i < this.numBlazes; i++) {
      this.blazes[i].display();
    }

    this.scene.gl.disable(this.scene.gl.BLEND);

    this.scene.popMatrix();
  }

  difference(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
  }

  squaredLength(v) {
    return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
  }

  collidesWith(position) {
    return this.squaredLength(this.difference(position, center)) < this.radius * this.radius * 0.8;
  }
}