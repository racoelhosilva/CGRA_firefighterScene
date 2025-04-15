import { CGFobject } from '../lib/CGF.js';

export class MyPyramid extends CGFobject {
  constructor(scene, faces, radius, height) {
    super(scene);
    this.faces = faces;
    this.radius = radius;
    this.height = height;

    this.initBuffers();
  }

  pushVertices() {
    for (let face = 0; face < this.faces; face++) {
      const angle = 2 * Math.PI * face / this.faces;
      const nextAngle = 2 * Math.PI * (face + 1) / this.faces;

      this.vertices.push(
        this.radius * Math.cos(angle), 0, this.radius * Math.sin(angle),          // Right vertex
        0, this.height, 0,                                                        // Top vertex
        this.radius * Math.cos(nextAngle), 0, this.radius * Math.sin(nextAngle),  // Left vertex
      );

      const midAngle = (angle + nextAngle) / 2;
      const beta = Math.atan2(this.radius, this.height);
      const normRadius = Math.cos(beta);
      const normal = [normRadius * Math.cos(midAngle), Math.sin(beta), normRadius * Math.sin(midAngle)];
      this.normals.push(
        ...normal,
        ...normal,
        ...normal,
      );
    }
  }

  pushFaces() {
    for (let face = 0; face < this.faces; face++)
      this.indices.push(face * 3, face * 3 + 1, face * 3 + 2);
  }

  initBuffers() {
    this.vertices = [];
    this.normals = [];
    this.indices = [];

    this.pushVertices();
    this.pushFaces();

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}