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
    this.texCoords = [];

    this.pushVertices();
    this.pushFaces();

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  pushVertices() {
    // Top vertex
    this.vertices.push(0, this.height, 0);
    this.normals.push(0, 1, 0);
    this.texCoords.push(0.5, 0.5);

    // Base vertices
    for (let slice = 0; slice < this.slices; slice++) {
      const alpha = 2 * Math.PI * slice / this.slices;
      const [nx, nz] = [Math.cos(alpha), Math.sin(alpha)];

      this.vertices.push(this.radius * nx, 0, this.radius * nz);
      this.normals.push(nx, 0, nz);
      this.texCoords.push((1 + nx) / 2, (1 + nz) / 2);
    }
  }

  pushFaces() {
    for (let slice = 0; slice < this.slices - 1; slice++)
      this.indices.push(slice + 1, 0, slice + 2);
    this.indices.push(this.slices, 0, 1);
  }
}