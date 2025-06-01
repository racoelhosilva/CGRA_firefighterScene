#ifdef GL_ES
precision highp float;
#endif

uniform float timeFactor;

uniform int phase;

void main() {
    float intensity = 0.5 + 0.25 * sin(timeFactor * 0.8);
    if (phase != 0) { // Lighten during maneuvers
        gl_FragColor = vec4(intensity, 0.1, 0.1, 1.0);
    } else { // Otherwise stay dark
        gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0);
    }
}
