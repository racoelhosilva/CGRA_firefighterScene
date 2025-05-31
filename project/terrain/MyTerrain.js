import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MyPlane } from "../MyPlane.js";

export class MyTerrain extends CGFobject {
    constructor(scene, side, terrainMaskPath, waterMap, elevationMap, grassTex, lakeTex, shader) {
        super(scene);

        this.side = side;
        this.plane = new MyPlane(scene, 255);

        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.material.setShininess(1.0);
        this.material.loadTexture(terrainMaskPath);
        this.material.setTextureWrap('REPEAT', 'REPEAT');

        this.waterMap = waterMap;
        this.elevationMap = elevationMap;
        this.grassTex = grassTex;
        this.lakeTex = lakeTex;
        this.shader = shader;

        this.shader.setUniformsValues({
            waterMap: 1,
            elevationMap: 2,
            grassTexture: 3,
            lakeTexture: 4
        });

        this.buildLakeMap(terrainMaskPath);
    }

    buildLakeMap(terrainMaskPath) {
        this.terrainMaskData = null;

        const canvas = document.createElement('canvas');
        canvas.width = this.side;
        canvas.height = this.side;
        const ctx = canvas.getContext('2d');

        const terrainMaskImg = new Image();
        terrainMaskImg.src = terrainMaskPath;
        terrainMaskImg.onload = () => {
            ctx.drawImage(terrainMaskImg, 0, 0, this.side, this.side);
            const imageData = ctx.getImageData(0, 0, this.side, this.side);
            this.terrainMaskData = imageData.data;
        };
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(this.side, 1, this.side);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);

        this.material.apply();
        this.waterMap.bind(1);
        this.elevationMap.bind(2);
        this.grassTex.bind(3);
        this.lakeTex.bind(4);

        this.scene.setActiveShader(this.shader);

        this.plane.display();

        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.setDefaultAppearance();
        this.scene.popMatrix();
    }

    isAboveWater(position) {
        if (!this.terrainMaskData)
            return false; // Lake map not ready

        const [x, z] = [position[0], position[2]];
        const u = (x + this.side / 2) / this.side;
        const v = (z + this.side / 2) / this.side;

        if (u < 0 || u > 1 || v < 0 || v > 1)
            return false; // Out of bounds

        const px = Math.floor(u * (this.side - 1));
        const py = Math.floor(v * (this.side - 1));

        const value = this.terrainMaskData[(py * this.side + px) * 4];
        return value < 128;
    }

    updateGrassTexture(newGrassTex) {
        this.grassTex = newGrassTex;
    }

    updateWaterTexture(newWaterTex) {
        this.lakeTex = newWaterTex;
    }
}
