import { CGFobject } from "../lib/CGF.js";

export class MyUnitCube extends CGFobject {
  constructor(scene) {
    super(scene);
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
      0.5, 0.5, 0.5,     // Corner in 1st octant
      0.5, -0.5, 0.5,    // Corner in 2nd octant
      -0.5, -0.5, 0.5,   // Corner in 3rd octant
      -0.5, 0.5, 0.5,    // Corner in 4th octant
      0.5, 0.5, -0.5,    // Corner in 5th octant
      0.5, -0.5, -0.5,   // Corner in 6th octant
      -0.5, -0.5, -0.5,  // Corner in 7th octant
      -0.5, 0.5, -0.5,   // Corner in 8th octant
    ];

    this.indices = [
      0, 1, 5, 0, 5, 4,  // Face to the positive xx side
      2, 3, 7, 2, 7, 6,  // Face to the negative xx side
      0, 4, 7, 0, 7, 3,  // Face to the positive yy side
      1, 2, 6, 6, 5, 1,  // Face to the negative yy side 
      0, 3, 2, 2, 1, 0,  // Face to the positive zz side
      7, 4, 5, 5, 6, 7,  // Face to the negative zz side
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;

    this.initGLBuffers();
  }
}