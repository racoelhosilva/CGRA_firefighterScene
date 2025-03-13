import { CGFobject } from "../lib/CGF.js";

export class MyPrism extends CGFobject {
  constructor(scene, slices, stacks) {
    super(scene);

    this.slices = slices;
    this.stacks = stacks;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = []
    this.indices = []
    this.normals = []

    let baseZ = 0;
    let base_step = 1 / this.stacks;
    let ang_step = 2 * Math.PI / this.slices;
    let index_start = 0;

    for (let stack = 0; stack < this.stacks; stack++) {
      // this.vertices.push(Math.cos(ang), 0, -Math.sin(ang));
      // this.indices.push(i, (i + 1) % this.slices, this.slices);
      // this.normals.push(Math.cos(ang), Math.cos(Math.PI / 4.0), -Math.sin(ang));
      // ang += alphaAng;

      for (let slice = 0; slice < this.slices; slice++) {
        this.vertices.push(
          Math.cos(ang_step * slice), Math.sin(ang_step * slice), baseZ,
          Math.cos(ang_step * (slice + 1)), Math.sin(ang_step * (slice + 1)), baseZ,
          Math.cos(ang_step * (slice + 1)), Math.sin(ang_step * (slice + 1)), baseZ + base_step,
          Math.cos(ang_step * slice), Math.sin(ang_step * slice), baseZ + base_step
        )

        this.indices.push(
          index_start, index_start + 1, index_start + 2,
          index_start + 2, index_start + 3, index_start,
          // index_start + 2, index_start + 1, index_start,
          // index_start, index_start + 3, index_start + 2
        )
        index_start += 4;

        let sideNormal = [Math.cos(ang_step * (slice + 0.5)), Math.sin(ang_step * (slice + 0.5)), 0];
        this.normals.push(
          ...sideNormal,
          ...sideNormal,
          ...sideNormal,
          ...sideNormal
        );
      }

      baseZ += base_step;
    }

		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
  }

  updateBuffers(complexity){

  }
}