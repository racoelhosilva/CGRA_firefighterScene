import { CGFappearance, CGFobject, CGFtexture } from "../../lib/CGF.js";
import { MyCube } from "../component/MyCube.js";
import { MyRectangle } from "../component/MyRectangle.js";

export class MyCeiling extends CGFobject {
    constructor(scene, width, depth, helipadTexture, upTexture, downTexture) {
        super(scene);
        this.width = width;
        this.depth = depth;
        this.helipadTexture = helipadTexture;
        this.upTexture = upTexture;
        this.downTexture = downTexture;

        // Helipad Material
        this.helipadMaterial = new CGFappearance(scene);
        this.helipadMaterial.setAmbient(0.3, 0.3, 0.3, 1);
        this.helipadMaterial.setShininess(1.0);
        this.helipadMaterial.setTexture(this.helipadTexture);
        this.helipadMaterial.setTextureWrap("REPEAT", "REPEAT");

        // Ceiling
        this.ceiling = new MyRectangle(this.scene, width, depth);

        // Helipad
        this.helipadSize = 2 * Math.min(width, depth) / 3;
        this.helipadXSpacing = (width - this.helipadSize) / 2;
        this.helipadZSpacing = (depth - this.helipadSize) / 2;
        this.helipad = new MyRectangle(this.scene, this.helipadSize, this.helipadSize);

        // Helipad Light
        this.lightSize = 1;
        this.light = new MyCube(this.scene, this.lightSize);
    }

    display(helipad) {
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.depth)
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.ceiling.display();
        this.scene.popMatrix();

        if (helipad) {
            this.helipadMaterial.apply();
            this.upTexture.bind(1);
            this.downTexture.bind(2);
            this.scene.setActiveShader(this.scene.movementShader);
            this.scene.pushMatrix();
            this.scene.translate(this.helipadXSpacing, this.scene.Z_CLASHING_OFFSET, this.helipadSize + this.helipadZSpacing);
            this.scene.rotate(-Math.PI / 2, 1, 0, 0);
            this.scene.gl.enable(this.scene.gl.BLEND);
            this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
            this.helipad.display();
            this.scene.gl.disable(this.scene.gl.BLEND);
            this.scene.popMatrix();
            this.scene.setActiveShader(this.scene.defaultShader);

            this.scene.setActiveShader(this.scene.pulsatingShader);
            this.scene.pushMatrix();
            this.scene.translate(- 0.5 * this.lightSize, 0, 0.5 * this.lightSize);
            for (let i = 0; i < 4; i++) {
                this.scene.pushMatrix();
                this.scene.translate(this.helipadXSpacing + (i % 2) * this.helipadSize, this.scene.Z_CLASHING_OFFSET, this.helipadZSpacing + Math.floor(i / 2) * this.helipadSize);
                this.scene.rotate(-Math.PI / 2, 1, 0, 0);
                this.light.display();
                this.scene.popMatrix();
            }
            this.scene.popMatrix();
            this.scene.setActiveShader(this.scene.defaultShader);
        }
    }

    updateSize(width, depth) {
        this.width = width;
        this.depth = depth;
        this.ceiling.updateSize(width, depth);

        this.helipadSize = 2 * Math.min(width, depth) / 3;
        this.helipadXSpacing = (width - this.helipadSize) / 2;
        this.helipadZSpacing = (depth - this.helipadSize) / 2;
        this.helipad.updateSize(this.helipadSize, this.helipadSize);
    }
}