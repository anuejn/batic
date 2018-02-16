out vec4 gl_fragColor;

void main(vec3 color) {
    gl_fragColor = vec4(color, 1.0);
}