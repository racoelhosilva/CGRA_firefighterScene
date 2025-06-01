import { CGFobject } from '../../lib/CGF.js';
import { MyTriangle } from '../component/MyTriangle.js';

export class MyBlaze extends CGFobject {
    FIRE_MIN_GREEN = 0.2;
    FIRE_MAX_GREEN = 0.7;

    constructor(scene, minHeight, maxHeight, radiusRatio, material, fire) {
        super(scene);

        this.triangle = this.buildTriangle(minHeight, maxHeight, radiusRatio);

        this.material = material;
        this.fire = fire;

        this.green = this.buildGreen(this.triangle.p3, minHeight, maxHeight);
        this.randomFactor = 0.5 + Math.random() * 1.5;
    }

    buildTriangle(minHeight, maxHeight, radiusRatio) {
        const height = minHeight + Math.random() ** 1.4 * (maxHeight - minHeight);
        const radius = radiusRatio * height;

        const base1 = this.buildRandomBaseVertex(radius);
        const base2 = this.buildRandomBaseVertex(radius);
        const top = this.buildRandomTopVertex(height, base1, base2);

        return new MyTriangle(this.scene, base1, base2, top, Math.round(8 * top[1] / maxHeight), true);
    }

    buildGreen(topVertex, minHeight, maxHeight) {
        return this.FIRE_MIN_GREEN + ((maxHeight - topVertex[1]) / (maxHeight - minHeight)) * (this.FIRE_MAX_GREEN - this.FIRE_MIN_GREEN);
    }

    buildRandomBaseVertex(radius) {
        const [r, theta] = [Math.random() * radius, Math.random() * 2 * Math.PI];
        const [x, z] = [r * Math.cos(theta), r * Math.sin(theta)];

        return [x, 0, z];
    }

    buildRandomTopVertex(height, baseVertex1, baseVertex2) {
        const [x, z] = [(baseVertex1[0] + baseVertex2[0]) / 2, (baseVertex1[2] + baseVertex2[2]) / 2];
        return [x, height, z];
    }

    display() {
        this.fire.shader.setUniformsValues({ green: this.green, randomFactor: this.randomFactor });
        this.material.apply();
        this.triangle.display();
    }
}