import { CGFobject } from '../../lib/CGF.js';
import { MyTriangle } from '../component/MyTriangle.js';

export class MyBlaze extends CGFobject {
  FIRE_RED = 0.8;
  FIRE_BLUE = 0.0;
  FIRE_MIN_GREEN = 0.0;
  FIRE_MAX_GREEN = 0.8;

  constructor(scene, radius, height, material) {
    super(scene);

    this.radius = radius;
    this.height = height;
    this.material = material;

    this.triangle = this.buildTriangle();
    this.color = this.buildColor(this.triangle.p3);
  }

  buildTriangle() {
    const p1 = this.buildRandomVertex(true);
    const p2 = this.buildRandomVertex(true);
    const p3 = this.buildRandomVertex(false);
    p3[0] = (p1[0] + p2[0]) / 2;
    p3[2] = (p1[2] + p2[2]) / 2;

    return new MyTriangle(this.scene, p1, p2, p3, true);
  }

  buildColor(topVertex) {
    let green = this.FIRE_MIN_GREEN + ((this.height - topVertex[1]) / this.height) * (this.FIRE_MAX_GREEN - this.FIRE_MIN_GREEN);
    return [this.FIRE_RED, green, this.FIRE_BLUE, 0.5];
  }

  buildRandomVertex(low) {
    const y = Math.random() ** 2 * (low ? 0.05 : 1) * this.height;
    const [r, theta] = [Math.random() * this.radius, Math.random() * 2 * Math.PI];
    const [x, z] = [r * Math.cos(theta), r * Math.sin(theta)];

    return [x, y, z];
  }

  display() {
    this.material.setEmission(...this.color);
    this.material.apply();
    this.triangle.display();
  }
}