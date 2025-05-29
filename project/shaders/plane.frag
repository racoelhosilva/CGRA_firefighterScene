precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D mask;
uniform sampler2D grassTexture;
uniform sampler2D lakeTexture;

void main() {
    vec4 maskColor = texture2D(mask, vTextureCoord);
    vec4 grassColor = texture2D(grassTexture, vTextureCoord);
    vec4 lakeColor = texture2D(lakeTexture, vTextureCoord);

    float maskValue = maskColor.r;

    vec4 color = mix(lakeColor, grassColor, maskValue);

    gl_FragColor = color;
}