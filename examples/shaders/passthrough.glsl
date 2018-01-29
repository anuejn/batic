#version 300 es
precision mediump float;

uniform sampler2D raw_image;
out vec4 fragColor;


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

    vec3 pixel_color;
    if(pos.x % 2 == 0) {
        if(pos.y % 2 == 0) {
            pixel_color = r;
        } else {
            pixel_color = g;
        }
    } else {
        if(pos.y % 2 == 0) {
            pixel_color = g;
        } else {
            pixel_color = b;
        }
    }

    return pixel_color;
}


void main(void) {
    ivec2 size = textureSize(raw_image, 0);
    ivec2 icord = ivec2(gl_FragCoord);
    ivec2 rotcord = ivec2(icord.x, size.y - icord.y);

    float color = texelFetch(raw_image, rotcord, 0).r;

    // pack the color into the gl_FragColor without transparency
	fragColor = vec4(get_color_value(rotcord) * color, 1.0);
}