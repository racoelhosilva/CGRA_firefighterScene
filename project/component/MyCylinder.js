import { CGFobject } from "../lib/CGF.js";

export class MyCylinder extends CGFobject {
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
    let baseStep = 1 / this.stacks;
    let alphaStep = 2 * Math.PI / this.slices;
    let indexStart = 0;

    for (let stack = 0; stack < this.stacks; stack++) {
      for (let slice = 0; slice < this.slices; slice++) {
        this.vertices.push(
          Math.cos(alphaStep * slice), Math.sin(alphaStep * slice), baseZ,
          Math.cos(alphaStep * slice), Math.sin(alphaStep * slice), baseZ + baseStep
        )

        if (slice < this.slices - 1) {
          this.indices.push(
            indexStart, indexStart + 2, indexStart + 3,
            indexStart + 3, indexStart + 1, indexStart,
          );
        } else {
          this.indices.push(
            indexStart, indexStart + 2 - 2 * this.slices, indexStart + 3 - 2 * this.slices,
            indexStart + 3 - 2 * this.slices, indexStart + 1, indexStart,
          );
        }
        indexStart += 2;

        let sideNormal = [Math.cos(alphaStep * slice), Math.sin(alphaStep * slice), 0];
        this.normals.push(
          ...sideNormal,
          ...sideNormal
        );
      }

      baseZ += baseStep;
    }

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
  }
}