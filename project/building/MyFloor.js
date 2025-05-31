import { CGFappearance, CGFobject, CGFtexture } from "../../lib/CGF.js";
import { MyRectangle } from "../component/MyRectangle.js";

export class MyFloor extends CGFobject {
    constructor(scene, width, depth, height, windows, windowTexture, doorTexture, bannerTexture) {
        super(scene);
        this.width = width;
        this.depth = depth;
        this.height = height;
        this.windows = windows;
        this.windowTexture = windowTexture;
        this.doorTexture = doorTexture;
        this.bannerTexture = bannerTexture;

        // Window Material
        this.windowMaterial = new CGFappearance(scene);
        this.windowMaterial.setAmbient(1.0, 1.0, 1.0, 1);
        this.windowMaterial.setDiffuse(0.8, 0.8, 0.8, 1);
        this.windowMaterial.setSpecular(0.2, 0.2, 0.2, 1);
        this.windowMaterial.setShininess(200.0);
        this.windowMaterial.setTexture(this.windowTexture);
        this.windowMaterial.setTextureWrap("REPEAT", "REPEAT");

        // Door Material
        this.doorMaterial = new CGFappearance(scene);
        this.doorMaterial.setAmbient(0.3, 0.3, 0.3, 1);
        this.doorMaterial.setShininess(1.0);
        this.doorMaterial.setTexture(this.doorTexture);
        this.doorMaterial.setTextureWrap("REPEAT", "REPEAT");

        // Banner Material
        this.bannerMaterial = new CGFappearance(scene);
        this.bannerMaterial.setAmbient(0.7, 0.7, 0.7, 1);
        this.bannerMaterial.setEmission(0.2, 0.2, 0.2, 1);
        this.bannerMaterial.setShininess(10.0);
        this.bannerMaterial.setTexture(this.bannerTexture);
        this.bannerMaterial.setTextureWrap("REPEAT", "REPEAT");

        // Floor
        this.xFloor = new MyRectangle(this.scene, depth, height);
        this.zFloor = new MyRectangle(this.scene, width, height);

        // Windows
        this.windowSize = width / 5;
        this.windowHorizontalSpacing = (width - (windows * this.windowSize)) / (windows + 1);
        this.windowVerticalSpacing = (height - this.windowSize) / 2;
        this.window = new MyRectangle(this.scene, this.windowSize, this.windowSize);

        // Door
        this.doorHeight = 3 * height / 5;
        this.doorWidth = width / 5;
        this.door = new MyRectangle(this.scene, this.doorWidth, this.doorHeight);

        // Banner
        this.bannerWidth = width / 2;
        this.bannerHeight = height / 5;
        this.banner = new MyRectangle(this.scene, this.bannerWidth, this.bannerHeight);
    }

    display(displayWindows) {
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.depth);
        this.zFloor.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.width, 0, this.depth);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.xFloor.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.width, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.zFloor.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.xFloor.display();
        this.scene.popMatrix();


        if (displayWindows) {
            this.windowMaterial.apply();
            this.scene.pushMatrix();
            this.scene.translate(this.windowHorizontalSpacing, this.windowVerticalSpacing, this.depth + this.scene.Z_CLASHING_OFFSET);
            for (let i = 0; i < this.windows; i++) {
                this.window.display();
                this.scene.translate(this.windowSize + this.windowHorizontalSpacing, 0, 0);
            }
            this.scene.popMatrix();
        } else {
            this.doorMaterial.apply();
            this.scene.pushMatrix();
            this.scene.translate(this.width / 2 - this.doorWidth / 2, 0, this.depth + this.scene.Z_CLASHING_OFFSET);
            this.door.display();
            this.scene.popMatrix();

            this.bannerMaterial.apply();
            this.scene.pushMatrix();
            this.scene.translate(this.width / 2 - this.bannerWidth / 2, (this.height - this.doorHeight - this.bannerHeight) / 2 + this.doorHeight, this.depth + 0.05);
            this.banner.display();
            this.scene.popMatrix();
        }

        this.windowMaterial.apply();
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(-this.windowHorizontalSpacing - this.windowSize, this.windowVerticalSpacing, this.scene.Z_CLASHING_OFFSET);
        for (let i = 0; i < this.windows; i++) {
            this.window.display();
            this.scene.translate(-this.windowSize - this.windowHorizontalSpacing, 0, 0);
        }
        this.scene.popMatrix();
    }

    updateSize(width, depth, height) {
        this.width = width;
        this.depth = depth;
        this.height = height;
        this.xFloor.updateSize(depth, height);
        this.zFloor.updateSize(width, height);

        this.windowSize = width / 5;
        this.windowHorizontalSpacing = (width - (this.windows * this.windowSize)) / (this.windows + 1);
        this.windowVerticalSpacing = (height - this.windowSize) / 2;
        this.window.updateSize(this.windowSize, this.windowSize);

        this.doorHeight = 3 * height / 5;
        this.doorWidth = width / 5;
        this.door.updateSize(this.doorWidth, this.doorHeight);

        this.bannerWidth = width / 2;
        this.bannerHeight = height / 5;
        this.banner.updateSize(this.bannerWidth, this.bannerHeight);
    }

    updateWindowNumber(windows) {
        this.windows = windows;
        this.windowHorizontalSpacing = (this.width - (windows * this.windowSize)) / (windows + 1);
    }

    updateWindowTexture(texture) {
        this.windowTexture = texture;
        this.windowMaterial.setTexture(this.windowTexture);
    }

    updateBannerTexture(texture) {
        this.bannerTexture = texture;
        this.bannerMaterial.setTexture(this.bannerTexture);
    }
}