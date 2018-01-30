#version 300 es
precision mediump float;

uniform sampler2D raw_image;
out vec4 fragColor;



float get_intensity(ivec2 pos) {
    return texelFetch(raw_image, pos, 0).r;
}

ivec2 get_pos() {
    ivec2 size = textureSize(raw_image, 0);
    ivec2 icord = ivec2(gl_FragCoord);
    return ivec2(icord.x, size.y - icord.y);
}


void main(void) {
    ivec2 pos = get_pos();

    vec3 color = vec3(get_intensity(pos));
    // pack the color into the gl_FragColor without transparency
    fragColor = vec4(color, 1.0);
}
