precision mediump float;

uniform float timeFactor;

void main() {
    float intensity = 0.5 + 0.25 * sin(timeFactor * 0.5);
    gl_FragColor = vec4(intensity, 0, 0, 1.0);
}
