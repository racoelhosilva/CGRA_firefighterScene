import { CGFobject } from "../../lib/CGF.js";

export class MyRegularPolygon extends CGFobject {
  constructor(scene, sides, radius, doubleSided = false) {
    super(scene);

    this.sides = sides;
    this.radius = radius;
    this.doubleSided = doubleSided;

    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.normals = [];
    this.texCoords = [];
    this.indices = [];

    this.pushVertices();
    this.pushFaces();

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  pushVertices() {
    // Center
    this.vertices.push(0, 0, 0);
    this.normals.push(0, 1, 0);
    this.texCoords.push(0.5, 0.5);

    // Border vertices
    for (let side = 0; side < this.sides; side++) {
      const alpha = 2 * Math.PI * side / this.sides;
      const [x, z] = [Math.cos(alpha), Math.sin(alpha)]

      this.vertices.push(this.radius * x, 0, this.radius * z);
      this.normals.push(0, 1, 0);
      this.texCoords.push((1 + x) / 2, (1 + z) / 2);
    }

    if (!this.doubleSided)
      return;

    this.vertices.push(...this.vertices);
    this.normals.push(...this.normals.map(v => -v));
    this.texCoords.push(...this.texCoords);
  }

  pushFaces() {
    for (let side = 0; side < this.sides - 1; side++) {
      this.indices.push(side + 1, 0, side + 2);
    }
    this.indices.push(this.sides, 0, 1);

    if (!this.doubleSided)
      return;

    for (let side = 0; side < this.sides - 1; side++) {
      this.indices.push(this.sides + side + 3, this.sides + 1, this.sides + side + 2);
    }
    this.indices.push(this.sides + 2, this.sides + 1, this.sides * 2 + 1);
  }
}