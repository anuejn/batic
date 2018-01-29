#version 300 es
precision mediump float;

uniform sampler2D raw_image;
out vec4 fragColor;

uniform float exposure;
uniform float offset;
uniform float pow_val;



float get_intensity(ivec2 pos) {
    return texelFetch(raw_image, pos, 0).r;
}

vec3 get_color_value(ivec2 pos) {
    /*
    the bayer pattern looks like this:
        rgrgrgrg . . .
        gbgbgbgb
        rgrgrgrg
        .
        .
        .
    */
    // define the intensitys of the beyer pattern
    vec3 r = vec3(1., 0., 0.);
    vec3 g = vec3(0., 1., 0.);
    vec3 b = vec3(0., 0., 1.);

    vec3 pixel_color = vec3(offset - .5);
    if(pos.x % 2 == 0 && pos.y % 2 == 0) {
        // red sensel
        pixel_color += r * get_intensity(pos - ivec2(0, 0));
        pixel_color += g * (get_intensity(pos - ivec2(0, 1)) + get_intensity(pos - ivec2(1, 0)) + get_intensity(pos - ivec2(-1, 0)) + get_intensity(pos - ivec2(0, -1))) / 4.;
        pixel_color += b * (get_intensity(pos - ivec2(1, 1)) + get_intensity(pos - ivec2(-1, -1)) + get_intensity(pos - ivec2(-1, 1)) + get_intensity(pos - ivec2(-1, 1))) / 4.;
    } else if (pos.x % 2 == 1 && pos.y % 2 == 1) {
        // blue sensel
        pixel_color += r * (get_intensity(pos - ivec2(1, 1)) + get_intensity(pos - ivec2(-1, -1)) + get_intensity(pos - ivec2(-1, 1)) + get_intensity(pos - ivec2(-1, 1))) / 4.;
        pixel_color += g * (get_intensity(pos - ivec2(0, 1)) + get_intensity(pos - ivec2(1, 0)) + get_intensity(pos - ivec2(-1, 0)) + get_intensity(pos - ivec2(0, -1))) / 4.;
        pixel_color += b * get_intensity(pos - ivec2(0, 0));
    } else {
        // green sensel
        pixel_color += g * get_intensity(pos - ivec2(0, 0));
        if(pos.y % 2 == 0) {
            pixel_color += b * (get_intensity(pos - ivec2(0, 1)) + get_intensity(pos - ivec2(0, -1)));
            pixel_color += r * (get_intensity(pos - ivec2(1, 0)) + get_intensity(pos - ivec2(-1, 0)));
        } else {
            pixel_color += r * (get_intensity(pos - ivec2(0, 1)) + get_intensity(pos - ivec2(0, -1)));
            pixel_color += b * (get_intensity(pos - ivec2(1, 0)) + get_intensity(pos - ivec2(-1, 0)));
        }
    }

    return pixel_color;
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