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
      0.5, -0.5, -0.5,   // Corner in 6th octant
      0.5, 0.5, -0.5,    // Corner in 5th octant

      -0.5, -0.5, 0.5,   // Corner in 3rd octant
      -0.5, 0.5, 0.5,    // Corner in 4th octant
      -0.5, 0.5, -0.5,   // Corner in 8th octant
      -0.5, -0.5, -0.5,  // Corner in 7th octant

      0.5, 0.5, 0.5,     // Corner in 1st octant
      0.5, 0.5, -0.5,    // Corner in 5th octant
      -0.5, 0.5, -0.5,   // Corner in 8th octant
      -0.5, 0.5, 0.5,    // Corner in 4th octant

      0.5, -0.5, 0.5,    // Corner in 2nd octant
      -0.5, -0.5, 0.5,   // Corner in 3rd octant
      -0.5, -0.5, -0.5,  // Corner in 7th octant
      0.5, -0.5, -0.5,   // Corner in 6th octant

      0.5, 0.5, 0.5,     // Corner in 1st octant
      -0.5, 0.5, 0.5,    // Corner in 4th octant
      -0.5, -0.5, 0.5,   // Corner in 3rd octant
      0.5, -0.5, 0.5,    // Corner in 2nd octant

      -0.5, 0.5, -0.5,   // Corner in 8th octant
      0.5, 0.5, -0.5,    // Corner in 5th octant
      0.5, -0.5, -0.5,   // Corner in 6th octant
      -0.5, -0.5, -0.5,  // Corner in 7th octant
    ];

    this.indices = [
      0, 1, 2, 0, 2, 3,  // Face to the positive xx side
      4, 5, 6, 4, 6, 7,  // Face to the negative xx side
      8, 9, 10, 8, 10, 11,  // Face to the positive yy side
      12, 13, 14, 12, 14, 15,  // Face to the negative yy side 
      16, 17, 18, 16, 18, 19,  // Face to the positive zz side
      20, 21, 22, 20, 22, 23,  // Face to the negative zz side
    ];

    this.normals = [
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
    ]

    this.primitiveType = this.scene.gl.TRIANGLES;

    this.initGLBuffers();
  }
}