import { CGFobject } from "../../lib/CGF.js";

export class MyTriangle extends CGFobject {
    constructor(scene, p1, p2, p3, complexity = 0, doubleSided = false) {
        super(scene);
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.complexity = complexity;
        this.doubleSided = doubleSided;

        this.initBuffers();
    }

    pushVertices() {
        const normal = this.normalize(this.crossProduct(this.difference(this.p2, this.p1), this.difference(this.p3, this.p1)));

        for (let i = 0; i <= this.complexity + 1; i++) {
            for (let j = 0; j <= this.complexity - i + 1; j++) {
                const u = i / (this.complexity + 1);
                const v = j / (this.complexity + 1);
                const w = (this.complexity + 1 - i - j) / (this.complexity + 1);

                this.vertices.push(
                    u * this.p1[0] + v * this.p2[0] + w * this.p3[0],
                    u * this.p1[1] + v * this.p2[1] + w * this.p3[1],
                    u * this.p1[2] + v * this.p2[2] + w * this.p3[2]
                );

                this.texCoords.push(
                    u * 0 + v * 1 + w * 0.5,
                    u * 1 + v * 1 + w * 0
                );

                this.normals.push(
                    ...normal,
                    ...normal,
                    ...normal
                );
            }
        }

        if (this.doubleSided) {
            this.vertices.push(...this.vertices);
            this.texCoords.push(...this.texCoords);
            this.normals.push(...this.normals.map((n) => -n));
        }
    }

    difference(v1, v2) {
        return [
            v1[0] - v2[0],
            v1[1] - v2[1],
            v1[2] - v2[2]
        ];
    }

    crossProduct(v1, v2) {
        return [
            v1[1] * v2[2] - v1[2] * v2[1],
            v1[2] * v2[0] - v1[0] * v2[2],
            v1[0] * v2[1] - v1[1] * v2[0]
        ];
    }

    normalize(v) {
        const length = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
        return [
            v[0] / length,
            v[1] / length,
            v[2] / length
        ];
    }

    pushFaces() {
        for (let u = 0; u < this.complexity + 1; u++) {
            for (let v = 0; v < this.complexity - u + 1; v++) {
                const a = u * (this.complexity + 3 - (u + 1) / 2) + v;
                const b = a + this.complexity - u + 2;
                const c = a + 1;

                this.indices.push(a, b, c);
                if (v < this.complexity - u) {
                    const d = b + 1;
                    this.indices.push(b, d, c);
                }
            }
        }

        if (this.doubleSided) {
            const halfVertices = this.vertices.length / 6;
            this.indices.push(...this.indices.map(index => index + halfVertices).reverse());
        }
    }

    initBuffers() {
        this.vertices = [];
        this.texCoords = [];
        this.normals = [];
        this.indices = [];

        this.pushVertices();
        this.pushFaces();

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
