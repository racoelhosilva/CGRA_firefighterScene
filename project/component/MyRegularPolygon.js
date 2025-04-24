import { CGFobject } from "../../lib/CGF.js";

export class MyRegularPolygon extends CGFobject {
  constructor(scene, sides, radius) {
    super(scene);

    this.sides = sides;
    this.radius = radius;

    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.normals = [];
    this.indices = [];

    this.pushVertices();
    this.pushFaces();

    console.log(this.vertices);
    console.log(this.normals);
    console.log(this.indices);

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  pushVertices() {
    // Center
    this.vertices.push(0, 0, 0);
    this.normals.push(0, 1, 0);

    // Border vertices
    for (let side = 0; side < this.sides; side++) {
      const alpha = 2 * Math.PI * side / this.sides;

      this.vertices.push(this.radius * Math.cos(alpha), 0, this.radius * Math.sin(alpha));
      this.normals.push(0, 1, 0);
    }
  }

  pushFaces() {
    for (let side = 0; side < this.sides - 1; side++)
      this.indices.push(side + 1, 0, side + 2);
    this.indices.push(this.sides, 0, 1);
  }
}