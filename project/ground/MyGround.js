import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MyPlane } from "../MyPlane.js";


export class MyGround extends CGFobject {
  constructor(scene, side, planeMaskPath, waterMap, grassTex, lakeTex, shader) {
    super(scene);

    this.side = side;
    this.plane = new MyPlane(scene, 128);

    this.material = new CGFappearance(this.scene);
    this.material.setAmbient(1.0, 1.0, 1.0, 1.0);
    this.material.setShininess(1.0);
    this.material.loadTexture(planeMaskPath);
    this.material.setTextureWrap('REPEAT', 'REPEAT');

    this.waterMap = waterMap;
    this.grassTex = grassTex;
    this.lakeTex = lakeTex;
    this.shader = shader;

    this.buildLakeMap(planeMaskPath);
  }

  buildLakeMap(planeMaskPath) {
    this.lakeMapData = null;

    const canvas = document.createElement('canvas');
    canvas.width = this.side;
    canvas.height = this.side;
    const ctx = canvas.getContext('2d');

    const lakeMapImg = new Image();
    lakeMapImg.src = planeMaskPath;
    lakeMapImg.onload = () => {
      ctx.drawImage(lakeMapImg, 0, 0, this.side, this.side);
      const imageData = ctx.getImageData(0, 0, this.side, this.side);
      this.lakeMapData = imageData.data;
    };
  }

  display() {
    this.scene.pushMatrix();
    this.scene.scale(this.side, 1, this.side);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);

    this.material.apply();
    this.waterMap.bind(1);
    this.grassTex.bind(2);
    this.lakeTex.bind(3);
    this.scene.setActiveShader(this.shader);

    this.plane.display();

    this.scene.setActiveShader(this.scene.defaultShader);
    this.scene.setDefaultAppearance();
    this.scene.popMatrix();
  }

  isAboveWater(position) {
    if (!this.lakeMapData)
      return false; // Lake map not ready

    const [x, z] = [position[0], position[2]];
    const u = (x + this.side / 2) / this.side;
    const v = (z + this.side / 2) / this.side;

    if (u < 0 || u > 1 || v < 0 || v > 1)
      return false; // Out of bounds

    const px = Math.floor(u * (this.side - 1));
    const py = Math.floor(v * (this.side - 1));

    const value = this.lakeMapData[(py * this.side + px) * 4];
    return value < 128;
  }
}
