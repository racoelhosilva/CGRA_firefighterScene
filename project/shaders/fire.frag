#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

void main() {
    vec4 texColor = texture2D(uSampler, vTextureCoord) * vec4(1.0, 0.5, 0.0, 1.0); // Orange tint
    gl_FragColor = vec4(texColor.rgb, 0.5); // 0.5 = 50% transparent
}