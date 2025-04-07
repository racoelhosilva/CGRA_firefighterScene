import { CGFobject } from "../lib/CGF.js";

export class MySphere extends CGFobject {
  constructor(scene, stacks, slices, inverted = false) {
    super(scene)

    this.stacks = stacks;
    this.slices = slices;
    this.inverted = inverted;

    this.initBuffers()
  }

  getVertexCoords(stack, slice) {
    const gamma = 2 * Math.PI * slice / this.slices;
    const beta = Math.PI / 2 * stack / this.stacks;
    const r = Math.cos(beta)

    return [r * Math.cos(gamma), r * Math.sin(gamma), Math.sin(beta)]
  }

  getTexCoords(stack, slice) {
    return [slice / this.slices, (this.stacks - stack) / (2 * this.stacks)]
  }

  pushEquatorVertex(slice) {
    const [x, y, _] = this.getVertexCoords(0, slice);
    const texCoords = this.getTexCoords(0, slice);

    this.vertices.push(x, y, 0);
    if (!this.inverted) {
      this.normals.push(x, y, 0);
    } else {
      this.normals.push(-x, -y, 0);
    }
    this.texCoords.push(...texCoords)
  }

  pushVertexNormalAndMirror(stack, slice) {
    const [x, y, z] = this.getVertexCoords(stack, slice);
    const [tx, ty] = this.getTexCoords(stack, slice);

    this.vertices.push(
      x, y, z,
      x, y, -z
    );

    if (!this.inverted) {
      this.normals.push(
        x, y, z,
        x, y, -z,
      );
    } else {
      this.normals.push(
        -x, -y, -z,
        -x, -y, z,
      );
    }

    this.texCoords.push(
      tx, ty,
      tx, 1 - ty
    );
  }

  pushPoles(slice) {
    this.vertices.push(
      0, 0, 1,
      0, 0, -1,
    );

    if (!this.inverted) {
      this.normals.push(
        0, 0, 1,
        0, 0, -1
      );
    } else {
      this.normals.push(
        0, 0, -1,
        0, 0, 1
      );
    }

    let middleU = (2 * slice + 1) / (2 * this.slices)
    this.texCoords.push(
      middleU, 0.0,
      middleU, 1.0
    )
  }

  initBuffers() {
    this.vertices = [];
    this.normals = [];
    this.texCoords = [];
    this.indices = [];

    // Equator
    for (let slice = 0; slice <= this.slices; slice++) {
      this.pushEquatorVertex(slice);
    }

    // Equator stacks
    if (this.stacks > 1) {
      this.pushVertexNormalAndMirror(1, 0);

      for (let slice = 1; slice <= this.slices; slice++) {
        this.pushVertexNormalAndMirror(1, slice);

        this.indices.push(
          slice - 1, slice, 2 * slice + this.slices + 1,
          2 * slice + this.slices + 1, 2 * slice + this.slices - 1, slice - 1,
          slice - 1, 2 * slice + this.slices, 2 * slice + this.slices + 2,
          2 * slice + this.slices + 2, slice, slice - 1,
        )
      }
    }

    // Hemisphere middle stacks
    for (let stack = 2; stack < this.stacks; stack++) {
      this.pushVertexNormalAndMirror(stack, 0);

      for (let slice = 1; slice <= this.slices; slice++) {
        this.pushVertexNormalAndMirror(stack, slice);

        let upperPlaneTr = (2 * stack - 1) * (this.slices + 1) + slice * 2;
        let lowerPlaneBr = upperPlaneTr + 1;

        this.indices.push(
          upperPlaneTr - 2 * this.slices - 4, upperPlaneTr - 2 * this.slices - 2, upperPlaneTr,
          upperPlaneTr, upperPlaneTr - 2, upperPlaneTr - 2 * this.slices - 4,
          lowerPlaneBr - 2 * this.slices - 4, lowerPlaneBr - 2, lowerPlaneBr,
          lowerPlaneBr, lowerPlaneBr - 2 * this.slices - 2, lowerPlaneBr - 2 * this.slices - 4,
        );
      }
    }

    // Poles
    for (let slice = 0; slice < this.slices; slice++) {
      this.pushPoles(slice);

      let northPole = (2 * this.stacks - 1) * (this.slices + 1) + slice * 2;
      let southPole = northPole + 1;

      this.indices.push(
        northPole - 2 * this.slices - 2, northPole - 2 * this.slices, northPole,
        southPole - 2 * this.slices, southPole - 2 * this.slices - 2, southPole,
      )
    }

    if (this.inverted)
      this.indices.reverse()

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}