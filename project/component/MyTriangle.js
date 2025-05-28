import { CGFobject } from "../../lib/CGF.js";

export class MyTriangle extends CGFobject {
  constructor(scene, p1, p2, p3, doubleSided = false) {
    super(scene);
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.doubleSided = doubleSided;

    this.initBuffers();
  }

  pushVertices() {
    this.vertices.push(
      ...this.p1,
      ...this.p2,
      ...this.p3
    )

    this.texCoords.push(
      0, 1,
      1, 1,
      0.5, 0
    );

    this.normals.push(
      ...this.normalize(this.crossProduct(this.difference(this.p2, this.p1), this.difference(this.p3, this.p1))),
      ...this.normalize(this.crossProduct(this.difference(this.p3, this.p2), this.difference(this.p1, this.p2))),
      ...this.normalize(this.crossProduct(this.difference(this.p1, this.p3), this.difference(this.p2, this.p3)))
    );

    if (this.doubleSided) {
      this.vertices.push(...this.vertices);
      this.texCoords.push(...this.texCoords);
      this.normals.push(...this.normals.map((n) => -n));
    }
  }

  difference(v1, v2) {
    return [
      v1[0] - v2[0],
      v1[1] - v2[1],
      v1[2] - v2[2]
    ];
  }

  crossProduct(v1, v2) {
    return [
      v1[1] * v2[2] - v1[2] * v2[1],
      v1[2] * v2[0] - v1[0] * v2[2],
      v1[0] * v2[1] - v1[1] * v2[0]
    ];
  }

  normalize(v) {
    const length = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
    return [
      v[0] / length,
      v[1] / length,
      v[2] / length
    ];
  }

  initBuffers() {
    this.vertices = [
      ...this.p1,
      ...this.p2,
      ...this.p3
    ];

    this.indices = [
      0, 1, 2
    ];
    if (this.doubleSided) {
      this.indices.push(0, 2, 1);
    }

    this.normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
    ];

    this.texCoords = [
      0, 1,
      1, 1,
      0.5, 0
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
