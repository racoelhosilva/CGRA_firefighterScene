#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;
uniform float green;

varying vec2 vTextureCoord;

void main() {
    vec4 texColor = texture2D(uSampler, vTextureCoord) * vec4(1.0, green, 0.0, 1.0);
    gl_FragColor = vec4(texColor.rgb, 0.5);
}