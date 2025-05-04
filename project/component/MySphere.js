import { CGFobject } from "../../lib/CGF.js";

export class MySphere extends CGFobject {
  constructor(scene, stacks, slices, inverted = false) {
    super(scene)

    this.stacks = stacks;
    this.slices = slices;
    this.inverted = inverted;

    this.initBuffers()
  }

  pushVertex(x, y, z, u, v) {
    this.vertices.push(x, y, z);
    if (!this.inverted) {
      this.normals.push(x, y, z);
    } else {
      this.normals.push(-x, -y, -z);
    }
    this.texCoords.push(u, v);
  }

  pushPole(isNorth, slice) {
    const [x, y, z] = [0, isNorth ? 1 : -1, 0];
    const [u, v] = [(2 * slice + 1) / (2 * this.slices), isNorth ? 0 : 1];

    this.pushVertex(x, y, z, u, v);
  }

  pushMiddleVertex(stack, slice) {
    const gamma = 2 * Math.PI * slice / this.slices;
    const beta = Math.PI / 2 * stack / this.stacks;
    const r = Math.cos(beta);

    const [x, y, z] = [r * Math.cos(gamma), Math.sin(beta), -r * Math.sin(gamma)];
    const [u, v] = [slice / this.slices, (this.stacks - stack) / (2 * this.stacks)];

    this.pushVertex(x, y, z, u, v);
  }

  pushAllVertices() {
    for (let slice = 0; slice < this.slices; slice++)
      this.pushPole(false, slice);

    for (let stack = -(this.stacks - 1); stack < this.stacks; stack++) {
      for (let slice = 0; slice <= this.slices; slice++) {
        this.pushMiddleVertex(stack, slice);
      }
    }

    for (let slice = 0; slice < this.slices; slice++)
      this.pushPole(true, slice);
  }

  pushTriangle(i, j, k) {
    if (this.inverted) {
      this.indices.push(i, j, k);
    } else {
      this.indices.push(i, k, j);
    }
  }

  pushPoleFace(isNorth, slice) {
    let pole, right, left;
    if (isNorth) {
      pole = this.slices + (2 * this.stacks - 1) * (this.slices + 1) + slice;
      right = pole - this.slices - 1;
      left = pole - this.slices;
      this.pushTriangle(pole, left, right);

    } else {
      pole = slice;
      right = pole + this.slices;
      left = pole + this.slices + 1;
      this.pushTriangle(pole, right, left);
    }
  }

  pushMiddleFace(stack, slice) {
    const bottomRight = this.slices + (this.stacks - 1 + stack) * (this.slices + 1) + slice;
    const bottomLeft = bottomRight + 1;
    const topRight = bottomRight + this.slices + 1;
    const topLeft = bottomRight + this.slices + 2;

    this.pushTriangle(bottomRight, topRight, topLeft);
    this.pushTriangle(topLeft, bottomLeft, bottomRight);
  }

  pushAllFaces() {
    for (let slice = 0; slice < this.slices; slice++)
      this.pushPoleFace(false, slice);

    for (let stack = -(this.stacks - 1); stack < this.stacks - 1; stack++) {
      for (let slice = 0; slice < this.slices; slice++)
        this.pushMiddleFace(stack, slice);
    }

    for (let slice = 0; slice < this.slices; slice++)
      this.pushPoleFace(true, slice);
  }

  initBuffers() {
    this.vertices = [];
    this.normals = [];
    this.texCoords = [];
    this.indices = [];

    this.pushAllVertices();
    this.pushAllFaces();

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}