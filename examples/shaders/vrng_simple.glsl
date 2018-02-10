#version 300 es
precision mediump float;

// https://anuejn.github.io/batic/

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

uniform float adjust_r;
uniform float adjust_g;
uniform float adjust_b;

// diagonal1 is lower-left<->upper-right
// diagonal2 is upper-left<->lower-right

void main(void) {
    ivec2 pos = get_pos();

    vec3 color = vec3(0.0, 0.0, 0.0);

    mat3 neigh = mat3(
        vec3(
            get_intensity(ivec2(pos.x-1, pos.y-1)),
            get_intensity(ivec2(pos.x, pos.y-1)),
            get_intensity(ivec2(pos.x+1, pos.y-1))
        ),
        vec3(
            get_intensity(ivec2(pos.x-1, pos.y)),
            get_intensity(pos),
            get_intensity(ivec2(pos.x+1, pos.y))
        ),
        vec3(
            get_intensity(ivec2(pos.x-1, pos.y+1)),
            get_intensity(ivec2(pos.x, pos.y+1)),
            get_intensity(ivec2(pos.x+1, pos.y+1))
        )
    );

    float grad_horizontal = abs(neigh[1][0] - neigh[1][2]);
    float grad_vertical = abs(neigh[0][1] - neigh[2][1]);

    float horizontal_fac = grad_horizontal / (grad_horizontal + grad_vertical);
    float intensity_hor_vert = horizontal_fac * (neigh[1][0] + neigh[1][2]) / 2.0 +
        (1.0 - horizontal_fac) * (neigh[0][1] + neigh[2][1]) / 2.0;

    float grad_diagonal1 = abs(neigh[2][2] - neigh[0][0]);
    float grad_diagonal2 = abs(neigh[2][0] - neigh[0][2]);

    float diagonal1_fac = grad_diagonal1 / (grad_diagonal1 + grad_diagonal2);
    float intensity_diag = diagonal1_fac * (neigh[2][2] + neigh[0][0]) / 2.0 +
        (1.0 - diagonal1_fac) * (neigh[2][0] + neigh[0][2]) / 2.0;

    if (pos.x%2==0 && pos.y%2==0) { // r
        color.r = neigh[1][1];
        color.g = intensity_hor_vert;
        color.b = intensity_diag;
    } else if (pos.x%2==1&&pos.y%2==1) { // b
        color.b = neigh[1][1];
        color.g = intensity_hor_vert;
        color.r = intensity_diag;
    } else if (pos.x%2==1&&pos.y%2==0) { // g-1
        color.g = neigh[1][1];
        color.r = (neigh[1][2] + neigh[1][0]) / 2.0;
        color.b = (neigh[2][1] + neigh[0][1]) / 2.0;
    } else { // g-2
        color.g = neigh[1][1];
        color.r = (neigh[2][1] + neigh[0][1]) / 2.0;
        color.b = (neigh[1][2] + neigh[1][0]) / 2.0;
    }

    vec3 color_scale = vec3(adjust_r, adjust_g, adjust_b) * 2.0;
    color *= color_scale;

    // pack the color into the gl_FragColor without transparency
    fragColor = vec4(color, 1.0);
}