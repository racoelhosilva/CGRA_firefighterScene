precision mediump float;

varying vec2 vTextureCoord;

uniform int phase;
uniform bool blinking;
uniform sampler2D textureDefault;
uniform sampler2D textureUp;
uniform sampler2D textureDown;

void main() {
    vec4 color;
    if (blinking && phase == 1) {
        color = texture2D(textureUp, vTextureCoord);
    } else if (blinking && phase == 2) {
        color = texture2D(textureDown, vTextureCoord);
    } else {
        color = texture2D(textureDefault, vTextureCoord);
    }
    gl_FragColor = color;
}