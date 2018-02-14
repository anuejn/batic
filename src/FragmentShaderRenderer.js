/**
 * @file renders fragment shaders onto a canvas
 */
"use strict";

module.exports = class FragmentShaderRenderer {
    /**
     * Initializes a new fragment shader renderer for the given canvas
     * @param canvas the canvas for rendering
     * @param options an object with the fields {size: {x: number, y: number}}
     */
    constructor(canvas, options) {
        this.options = options;

        this.canvas = canvas;
        this.gl = canvas.getContext("webgl2");
        let gl = this.gl;
        this.program = gl.createProgram();


        // set the data for drawing the base sqauare from 2 triangles
        this.vertex_shader = this._createShader(gl.VERTEX_SHADER,
            `#version 300 es
            in vec2 position;
            
            void main() {
                gl_Position = vec4( position.x, position.y, 1.0, 1.0 );
            }`);
        gl.attachShader(this.program, this.vertex_shader);

        this.fragment_shader = this._createShader(gl.FRAGMENT_SHADER,
            `#version 300 es
            precision mediump float;
            
            out vec4 fragColor;
            
            void main() {
                fragColor = vec4( 0. );
            }`);
        gl.attachShader(this.program, this.fragment_shader);

        gl.linkProgram(this.program);

        this.base_triangle_points = [
            -1, -1,
            -1, 1,
            1, 1,
            -1, -1,
            1, 1,
            1, -1
        ];
        let positionAttributeLocation = this._setVertexAttribute("position", this.base_triangle_points);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);


        // set the canvas and the viewport size
        gl.viewport(0, 0, this.options.size.x, this.options.size.y);
        gl.canvas.width = this.options.size.x;
        gl.canvas.height = this.options.size.y;
    }

    /**
     * renders the current shader. this method should be called after every e
     */
    render() {
        let gl = this.gl;

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(this.program);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    /**
     * sets the fragment shader code, that should be rendered to the canvas
     * @param code the glsl code of the fragment shader
     */
    setFragmentShader(code) {
        let gl = this.gl;

        this.fragment_shader_code = code;

        gl.detachShader(this.program, this.fragment_shader);
        this.fragment_shader = this._createShader(gl.FRAGMENT_SHADER, this.fragment_shader_code);
        gl.attachShader(this.program, this.fragment_shader);

        gl.linkProgram(this.program);
        let success = gl.getProgramParameter(this.program, gl.LINK_STATUS);
        if (!success) {
            console.log(this.gl.getProgramInfoLog(this.program));
        }
    }

    /**
     * sets a texture for the FragmentShaderRenderer
     * @param name the name of the sampler2D
     * @param data the data of the texture
     * @param size the size of the texture in the form {x: number, y: number}
     * @param options the options for the texture sampler
     */
    setTexture2D(name, data, size, options) {
        let gl = this.gl;
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        Object.keys(options).forEach(k => {
            gl.texParameteri(gl.TEXTURE_2D, this._getGlConst(k), this._getGlConst(options[k]));
        });
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, size.x, size.y, 0, gl.RED, gl.FLOAT, data);
    }

    /**
     * sets a uniform for the FragmentShaderRenderer
     * @param name the mane of the uniform
     * @param type the type of the uniform ie. uniform1f
     * @param data the data that should be in the uniform
     */
    setUniform(name, type, data) {
        gl.useProgram(this.program);
        let loc = gl.getUniformLocation(program, name);
        this._getGlConst(type)(loc, data);
    }



    _createShader(type, source) {
        let gl = this.gl;

        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

        if (success) {
            return shader;
        } else {
            gl.deleteShader(shader);
            throw {type: "compilation error", payload: gl.getShaderInfoLog(shader)};
        }
    }

    _setVertexAttribute(name, data) {
        let gl = this.gl;

        let attributeLocation = gl.getAttribLocation(this.program, name);
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(attributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        return attributeLocation;
    }

    _getGlConst(name) {
        return this.gl[name];
    }
};
