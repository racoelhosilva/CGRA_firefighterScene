import { CGFobject } from "../lib/CGF.js";

export class MySphere extends CGFobject {
  constructor(scene, stacks, slices) {
    super(scene)

    this.stacks = stacks;
    this.slices = slices;

    this.initBuffers()
  }

  getVertex(stack, slice) {
    const gamma = 2 * Math.PI * slice / this.slices;
    const beta = Math.PI / 2 * stack / this.stacks;
    const r = Math.cos(beta)

    return [r * Math.cos(gamma), r * Math.sin(gamma), Math.sin(beta)]
  }

  getTexVertex(stack, slice) {
    return [slice / this.slices, (1 + stack / this.stacks) / 2]
  }

  getVertexAndMirror(stack, slice) {
    const [x, y, z] = this.getVertex(stack, slice)
    return [x, y, z, x, y, -z]
  }

  getTexVertexAndMirror(stack, slice) {
    const [x, y] = this.getTexVertex(stack, slice)
    return [x, y, x, 1 - y]
  }

  initBuffers() {
    this.vertices = []
    this.indices = []

    // Equator
    for (let slice = 0; slice <= this.slices; slice++) {
      this.vertices.push(...this.getVertex(0, slice))
    }

    // Equator stacks
    this.vertices.push(...this.getVertexAndMirror(1, 0))

    for (let slice = 1; slice <= this.slices; slice++) {
      this.vertices.push(...this.getVertexAndMirror(1, slice))

      this.indices.push(
        slice - 1, 2 * slice + this.slices - 1, 2 * slice + this.slices + 1,
        2 * slice + this.slices + 1, slice, slice - 1,
        slice - 1, slice, 2 * slice + this.slices + 2,
        2 * slice + this.slices + 2, 2 * slice + this.slices, slice - 1,
      )

    }

    // Hemisphere middle stacks
    for (let stack = 2; stack < this.stacks; stack++) {
      this.vertices.push(...this.getVertexAndMirror(stack, 0))

      for (let slice = 1; slice <= this.slices; slice++) {
        this.vertices.push(...this.getVertexAndMirror(stack, slice))

        let upperPlaneTr = (2 * stack - 1) * (this.slices + 1) + slice * 2;
        let lowerPlaneBr = upperPlaneTr + 1;

        this.indices.push(
          upperPlaneTr - 2 * this.slices - 4, upperPlaneTr - 2, upperPlaneTr,
          upperPlaneTr, upperPlaneTr - 2 * this.slices - 2, upperPlaneTr - 2 * this.slices - 4,
          lowerPlaneBr - 2 * this.slices - 4, lowerPlaneBr - 2 * this.slices - 2, lowerPlaneBr,
          lowerPlaneBr, lowerPlaneBr - 2, lowerPlaneBr - 2 * this.slices - 4,
        );
        console.log
      }
    }

    // Poles
    for (let slice = 0; slice < this.slices; slice++) {
      this.vertices.push(
        0, 0, 1,
        0, 0, -1,
      );

      let northPole = (2 * this.stacks - 1) * (this.slices + 1) + slice * 2;
      let southPole = northPole + 1;

      this.indices.push(
        northPole - 2 * this.slices, northPole - 2 * this.slices - 2, northPole,
        southPole - 2 * this.slices - 2, southPole - 2 * this.slices, southPole,
      )
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}