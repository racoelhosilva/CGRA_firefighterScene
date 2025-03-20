import {CGFobject} from '../lib/CGF.js';
/**
 * MyTriangleBig
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangleBig extends CGFobject {
	constructor(scene, secondTriangle) {
		super(scene);
		this.secondTriangle = secondTriangle;
		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [
			2, 0, 0,	//0
			0, 2, 0,	//1
			-2, 0, 0,	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
		]

		if (!this.secondTriangle) {
			this.texCoords = [
				0.0, 0.0,
				1.0, 0.0,
				0.5, 0.5
			]
		} else {
			this.texCoords = [
				1.0, 0.0,
				1.0, 1.0,
				0.5, 0.5
			]
		}

		this.texCoords

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}
}

