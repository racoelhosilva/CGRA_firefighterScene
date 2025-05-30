import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MyPlane } from "../MyPlane.js";


export class MyGround extends CGFobject {
  constructor(scene, side, planeMaskPath, waterMap, grassTex, lakeTex, shader) {
    super(scene);

    this.side = side;
    this.plane = new MyPlane(scene, 128);

    this.planeMask = new CGFappearance(this.scene);
    this.planeMask.setAmbient(1.0, 1.0, 1.0, 1.0);
    this.planeMask.setShininess(1.0);
    this.planeMask.loadTexture(planeMaskPath);
    this.planeMask.setTextureWrap('REPEAT', 'REPEAT');

    this.waterMap = waterMap;
    this.grassTex = grassTex;
    this.lakeTex = lakeTex;

    this.shader = shader;
  }

  display() {
    this.scene.pushMatrix();
    this.scene.scale(this.side, 1, this.side);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);

    this.planeMask.apply();
    this.waterMap.bind(1);
    this.grassTex.bind(2);
    this.lakeTex.bind(3);
    this.scene.setActiveShader(this.shader);

    this.plane.display();

    this.scene.setActiveShader(this.scene.defaultShader);
    this.scene.setDefaultAppearance();
    this.scene.popMatrix();
  }
}
