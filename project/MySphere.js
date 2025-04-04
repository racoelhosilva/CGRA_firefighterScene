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

  getVertexAndMirror(stack, slice) {
    const [x, y, z] = this.getVertex(stack, slice)
    return [x, y, z, x, y, -z]
  }

  initBuffers() {
    this.vertices = []
    this.indices = []

    // Equator
    for (let slice = 0; slice < this.slices; slice++) {
      this.vertices.push(...this.getVertex(0, slice))
    }

    // Equator stacks
    this.vertices.push(...this.getVertexAndMirror(1, 0))

    for (let slice = 1; slice < this.slices; slice++) {
      this.vertices.push(...this.getVertexAndMirror(1, slice))

      this.indices.push(
        slice - 1, 2 * slice + this.slices - 2, 2 * slice + this.slices,
        2 * slice + this.slices, slice, slice - 1,
        slice - 1, slice, 2 * slice + this.slices + 1,
        2 * slice + this.slices + 1, 2 * slice + this.slices - 1, slice - 1,
      )
    }

    this.indices.push(
      this.slices - 1, 3 * this.slices - 2, this.slices,
      this.slices, 0, this.slices - 1,
      this.slices - 1, 0, this.slices + 1,
      this.slices + 1, 3 * this.slices - 1, this.slices - 1,
    )

    // Hemisphere middle stacks
    for (let stack = 2; stack < this.stacks; stack++) {
      this.vertices.push(...this.getVertexAndMirror(stack, 0))

      for (let slice = 1; slice < this.slices; slice++) {
        this.vertices.push(...this.getVertexAndMirror(stack, slice))

        let upperPlaneTr = (2 * stack - 1) * this.slices + slice * 2;
        let lowerPlaneBr = upperPlaneTr + 1;

        this.indices.push(
          upperPlaneTr - 2 * this.slices - 2, upperPlaneTr - 2, upperPlaneTr,
          upperPlaneTr, upperPlaneTr - 2 * this.slices, upperPlaneTr - 2 * this.slices - 2,
          lowerPlaneBr - 2 * this.slices - 2, lowerPlaneBr - 2 * this.slices, lowerPlaneBr,
          lowerPlaneBr, lowerPlaneBr - 2, lowerPlaneBr,
        )
      }

      let upperPlaneTr = (2 * stack - 1) * this.slices;
      let lowerPlaneBr = upperPlaneTr + 1;

      this.indices.push(
        upperPlaneTr - 2, upperPlaneTr + 2 * this.slices - 2, upperPlaneTr,
        upperPlaneTr, upperPlaneTr - 2 * this.slices, upperPlaneTr - 2,
        lowerPlaneBr - 2, lowerPlaneBr - 2 * this.slices, lowerPlaneBr,
        lowerPlaneBr, lowerPlaneBr + 2 * this.slices - 2, lowerPlaneBr - 2,
      )
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}