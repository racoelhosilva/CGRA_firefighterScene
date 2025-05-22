import { CGFappearance, CGFobject } from '../../lib/CGF.js';
import { MyTriangle } from '../component/MyTriangle.js';

export class MyBlaze extends CGFobject {
  FIRE_RED = 0.8;
  FIRE_BLUE = 0.0;
  FIRE_MIN_GREEN = 0.0;
  FIRE_MAX_GREEN = 0.8;

  constructor(scene, radius, height, numTriangles, texture) {
    super(scene);

    this.radius = radius;
    this.height = height;
    this.numTriangles = numTriangles;

    this.material = new CGFappearance(scene);
    this.material.setSpecular(0.0, 0.0, 0.0, 1.0);
    this.material.setDiffuse(0.0, 0.0, 0.0, 1.0);
    this.material.setAmbient(0.0, 0.0, 0.0, 1.0);
    this.material.setTexture(texture);

    this.triangles = this.buildTriangles();
    this.triangleGreens = this.buildTriangleGreens();
  }

  buildTriangles() {
    const triangles = [];

    for (let i = 0; i < this.numTriangles; i++) {
      const p1 = this.buildRandomVertex();
      const p2 = this.buildRandomVertex();
      const p3 = this.buildRandomVertex();

      triangles.push(new MyTriangle(this.scene, p1, p2, p3, true));
    }

    return triangles;
  }

  buildRandomVertex() {
    const y = Math.random() ** 2 * this.height;
    const [r, theta] = [Math.random() * this.radius, Math.random() * 2 * Math.PI];
    const [x, z] = [r * Math.cos(theta), r * Math.sin(theta)];

    return [x, y, z];
  }

  buildTriangleGreens() {
    const greens = [];

    for (let i = 0; i < this.numTriangles; i++) {
      greens.push(this.FIRE_MIN_GREEN + Math.random() * (this.FIRE_MAX_GREEN - this.FIRE_MIN_GREEN));
    }

    return greens;
  }

  display() {
    for (let i = 0; i < this.numTriangles; i++) {
      this.material.setEmission(this.FIRE_RED, this.triangleGreens[i], this.FIRE_BLUE, 1.0);
      this.material.apply();

      this.triangles[i].display();
    }
  }
}