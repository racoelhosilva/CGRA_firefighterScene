precision mediump float;

uniform float timeFactor;

uniform int phase;

void main() {
    float intensity = 0.5 + 0.25 * sin(timeFactor * 0.5);
    if (phase != 0) {
        gl_FragColor = vec4(intensity, 0.1, 0.1, 1.0);
    } else {
        gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0);
    }
}
