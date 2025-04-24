import { CGFobject } from "../../lib/CGF.js";

export class MyCone extends CGFobject {
  constructor(scene, slices, radius, height) {
    super(scene);

    this.slices = slices;
    this.radius = radius;
    this.height = height;

    this.initBuffers()
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

  pushVertices() {
    // Top vertex
    this.vertices.push(0, this.height, 0);
    this.normals.push(0, 1, 0);

    // Base vertices
    for (let slice = 0; slice < this.slices; slice++) {
      const alpha = 2 * Math.PI * slice / this.slices;

      this.vertices.push(this.radius * Math.cos(alpha), 0, this.radius * Math.sin(alpha));
      this.normals.push(Math.cos(alpha), 0, Math.sin(alpha));
    }
  }

  pushFaces() {
    for (let slice = 0; slice < this.slices - 1; slice++)
      this.indices.push(slice + 1, 0, slice + 2);
    this.indices.push(this.slices, 0, 1);
  }
}