import { CGFappearance, CGFobject, CGFtexture } from "../lib/CGF.js";
import { MyRectangle } from "./MyRectangle.js";

export class MyCeiling extends CGFobject {
    constructor(scene, width, depth) {
        super(scene);
        this.width = width;
        this.depth = depth;

        // Ceiling
        this.ceiling = new MyRectangle(this.scene, width, depth);

        // Helipad
        this.helipadSize = Math.min(width, depth) / 2;
        this.helipadXSpacing = (width - this.helipadSize) / 2;
        this.helipadZSpacing = (depth - this.helipadSize) / 2;
        this.helipad = new MyRectangle(this.scene, this.helipadSize, this.helipadSize);

        // Helipad texture
        this.helipadTexture = new CGFtexture(this.scene, "textures/helipad.jpeg");
        this.helipadAppearance = new CGFappearance(this.scene);
        this.helipadAppearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.helipadAppearance.setShininess(1.0);
        this.helipadAppearance.setTexture(this.helipadTexture);
        this.helipadAppearance.setTextureWrap("REPEAT", "REPEAT");
    }

    display(helipad) {
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.depth)
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.ceiling.display();
        this.scene.popMatrix();

        if (helipad) {
            this.helipadAppearance.apply();
            this.scene.pushMatrix();
            this.scene.translate(this.helipadXSpacing, this.scene.Z_CLASHING_OFFSET, this.helipadSize + this.helipadZSpacing);
            this.scene.rotate(-Math.PI / 2, 1, 0, 0);
            this.helipad.display();
            this.scene.popMatrix();
        }
    }

    updateSize(width, depth) {
        this.width = width;
        this.depth = depth;
        this.ceiling.updateSize(width, depth);

        this.helipadSize = Math.min(width, depth) / 2;
        this.helipadXSpacing = (width - this.helipadSize) / 2;
        this.helipadZSpacing = (depth - this.helipadSize) / 2;
        this.helipad.updateSize(this.helipadSize, this.helipadSize);
    }
}