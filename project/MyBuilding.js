import { CGFobject } from '../lib/CGF.js';

export class MyBuilding extends CGFobject {
    constructor(scene, width, floors, windows, windowType, buildingColor) {
        super(scene);
        this.width = width;
        this.floors = floors;
        this.windows = windows;
        this.windowType = windowType;
        this.buildingColor = buildingColor;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            -200, 0, -200,
            0, 0, -200,
            -200, 100, -200 
        ];

        this.indices = [
            0, 1, 2
        ];

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1 
        ];

        this.texCoords = [
            0, 0,
            1, 0,
            0, 1 
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}