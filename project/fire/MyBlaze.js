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
    const p1 = this.buildRandomBaseVertex();
    const p2 = this.buildRandomBaseVertex();
    const p3 = this.buildRandomTopVertex(p1, p2);

    return new MyTriangle(this.scene, p1, p2, p3, 4, true);
  }

  buildColor(topVertex) {
    let green = this.FIRE_MIN_GREEN + ((this.height - topVertex[1]) / this.height) * (this.FIRE_MAX_GREEN - this.FIRE_MIN_GREEN);
    return [this.FIRE_RED, green, this.FIRE_BLUE, 0.7];
  }

  buildRandomBaseVertex() {
    const y = Math.random() * 0.05 * this.height;
    const [r, theta] = [Math.random() * this.radius, Math.random() * 2 * Math.PI];
    const [x, z] = [r * Math.cos(theta), r * Math.sin(theta)];

    return [x, y, z];
  }

  buildRandomTopVertex(baseVertex1, baseVertex2) {
    const y = Math.random() ** 1.4 * this.height;
    const [x, z] = [(baseVertex1[0] + baseVertex2[0]) / 2, (baseVertex1[2] + baseVertex2[2]) / 2];
    return [x, y, z];
  }

  display() {
    this.material.setEmission(...this.color);
    this.material.apply();
    this.triangle.display();
  }
}