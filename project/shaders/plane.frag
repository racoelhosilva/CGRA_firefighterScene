precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D mask;
uniform sampler2D grassTexture;
uniform sampler2D lakeTexture;
uniform float timeFactor;

void main() {
    vec4 maskColor = texture2D(mask, vTextureCoord);
    vec4 grassColor = texture2D(grassTexture, vTextureCoord);
    vec4 lakeColor = texture2D(lakeTexture, mod(vTextureCoord + 0.003 * sin(400.0 * timeFactor), 1.0));

    float maskValue = maskColor.r;
    gl_FragColor = mix(lakeColor, grassColor, maskValue);
}