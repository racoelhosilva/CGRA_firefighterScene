import { CGFobject } from '../../lib/CGF.js';
import { MyTriangle } from '../component/MyTriangle.js';

export class MyBlaze extends CGFobject {
  FIRE_MIN_GREEN = 0.2;
  FIRE_MAX_GREEN = 0.7;

  constructor(scene, radius, height, material, fire) {
    super(scene);

    this.radius = radius;
    this.height = height;
    this.material = material;
    this.fire = fire;

    this.triangle = this.buildTriangle();
    this.green = this.buildGreen(this.triangle.p3);
    this.randomFactor = 0.5 + Math.random() * 1.5;
  }

  buildTriangle() {
    const base1 = this.buildRandomBaseVertex();
    const base2 = this.buildRandomBaseVertex();
    const top = this.buildRandomTopVertex(base1, base2);

    return new MyTriangle(this.scene, base1, base2, top, Math.round(10 * top[1] / this.height), true);
  }

  buildGreen(topVertex) {
    return this.FIRE_MIN_GREEN + ((this.height - topVertex[1]) / this.height) * (this.FIRE_MAX_GREEN - this.FIRE_MIN_GREEN);
  }

  buildRandomBaseVertex() {
    const [r, theta] = [Math.random() * this.radius, Math.random() * 2 * Math.PI];
    const [x, z] = [r * Math.cos(theta), r * Math.sin(theta)];

    return [x, 0, z];
  }

  buildRandomTopVertex(baseVertex1, baseVertex2) {
    const y = Math.random() ** 1.4 * this.height;
    const [x, z] = [(baseVertex1[0] + baseVertex2[0]) / 2, (baseVertex1[2] + baseVertex2[2]) / 2];
    return [x, y, z];
  }

  display() {
    this.fire.shader.setUniformsValues({ green: this.green, randomFactor: this.randomFactor });
    this.material.apply();
    this.triangle.display();
  }
}