#version 300 es
precision mediump float;

uniform sampler2D raw_image;
out vec4 fragColor;

uniform float exposure;
uniform float pow_val;
uniform float r_weight;
uniform float g_weight;
uniform float b_weight;



float get_intensity(ivec2 pos) {
    return texelFetch(raw_image, pos, 0).r;
}

vec3 r = vec3(1., 0., 0.);
vec3 g = vec3(0., 1., 0.);
vec3 b = vec3(0., 0., 1.);
vec3 get_color_value(ivec2 pos) {
     if(pos.x % 2 == 0 && pos.y % 2 == 0) {
         return r;
     } else if (pos.x % 2 == 1 && pos.y % 2 == 1) {
         return b;
     } else {
         return g;
     }
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
