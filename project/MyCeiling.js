import { CGFappearance, CGFobject, CGFtexture } from "../lib/CGF.js";
import { MyHelipad } from "./MyHelipad.js";

export class MyCeiling extends CGFobject {
    constructor(scene, width, depth) {
        super(scene);
        this.width = width;
        this.depth = depth;

        // Helipad
        this.helipadSize = Math.min(width, depth) / 2;
        this.helipadXSpacing = (width - this.helipadSize) / 2;
        this.helipadZSpacing = (depth - this.helipadSize) / 2;
        this.helipad = new MyHelipad(this.scene, this.helipadSize, this.helipadSize);

        // Helipad texture
        this.helipadTexture = new CGFtexture(this.scene, "textures/helipad.jpeg");
        this.helipadAppearance = new CGFappearance(this.scene);
        this.helipadAppearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.helipadAppearance.setShininess(1.0);
        this.helipadAppearance.setTexture(this.helipadTexture);
        this.helipadAppearance.setTextureWrap("REPEAT", "REPEAT");

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            this.width, 0, this.depth,
            this.width, 0, 0,
            0, 0, 0,
            0, 0, this.depth,
        ]

        this.indices = [
            0, 1, 2,
            0, 2, 3,
        ];
    
        this.normals = [
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display(helipad) {
        super.display();

        if (helipad) {
            this.helipad.enableNormalViz();
            this.helipadAppearance.apply();
            this.scene.pushMatrix();
            this.scene.translate(this.helipadXSpacing, 0.05, this.helipadZSpacing);
            this.helipad.display();
            this.scene.popMatrix();
        }

    }

    updateSize(width, depth) {
        this.width = width;
        this.depth = depth;
        this.initBuffers();
        this.initNormalVizBuffers();

        this.helipadSize = Math.min(width, depth) / 2;
        this.helipadXSpacing = (width - this.helipadSize) / 2;
        this.helipadZSpacing = (depth - this.helipadSize) / 2;
        this.helipad.updateSize(this.helipadSize, this.helipadSize);
    }
}