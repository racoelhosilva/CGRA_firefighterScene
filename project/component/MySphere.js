import { MyEllipsoid } from "./MyEllipsoid.js";

export class MySphere extends MyEllipsoid {
    constructor(scene, radius, stacks, slices, inverted = false) {
        super(scene, radius, radius, radius, stacks, slices, inverted);
    }
}