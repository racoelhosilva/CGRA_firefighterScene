#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;
uniform float green;

varying vec2 vTextureCoord;

void main() {
    vec4 maxColor = vec4(1.0, green, 0.0, 1.0);  // Corresponds to the brightest spots of the fire
    vec4 texColor = texture2D(uSampler, vTextureCoord) * maxColor;
    gl_FragColor = vec4(texColor.rgb, 0.5);
}