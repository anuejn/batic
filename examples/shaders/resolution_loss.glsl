#version 300 es
precision mediump float;

uniform sampler2D raw_image;
out vec4 fragColor;

uniform float exposure;
uniform float pow_val;



float get_intensity(ivec2 pos) {
    return texelFetch(raw_image, pos, 0).r;
}

vec3 get_color_value(ivec2 pos) {
     int x = (pos.x/2)*2;
     int y = (pos.y/2)*2;

    float r = get_intensity(ivec2(x, y));
    float g1 = get_intensity(ivec2(x+1, y));
    float g2 = get_intensity(ivec2(x, y+1));
    float b = get_intensity(ivec2(x+1, y+1));

    vec3 col = vec3(r, (g1+g2)/2.0, b);
    return col;
}


void main(void) {
    ivec2 size = textureSize(raw_image, 0);
    ivec2 icord = ivec2(gl_FragCoord);
    ivec2 rotcord = ivec2(icord.x, size.y - icord.y);

    vec3 debayered = get_color_value(rotcord);
    vec3 clamped = max(debayered, vec3(0.));
    vec3 powed = pow(clamped, vec3(pow_val * 2.));
    vec3 exposured = powed * exposure * 2.;


    // pack the color into the gl_FragColor without transparency
   fragColor = vec4(exposured, 1.0);
}