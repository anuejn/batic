/**
 * @file renders fragment shaders onto a canvas
 */
"use strict";

import React from "react";

export default class FragmentShaderRenderer extends React.Component {
    render() {
        // everything is manages by the lifecycle functions.
        return <canvas ref={c => { this.canvas = c; }}/>;
    }

    componentDidMount() {
        this.compilerCallback = this.props.compilerCallback ? this.props.compilerCallback : () => null;

        this.gl = this.canvas.getContext("webgl2");
        if(!this.gl) {
            this.compilerCallback("Error. Webgl2 is not supported in your browser");
            return;
        }
        let gl = this.gl;
        this.program = gl.createProgram();

        // initialize with dummy shader
        this._setShader('FRAGMENT_SHADER',
            `#version 300 es
            precision mediump float;

            out vec4 fragColor;

            void main() {
                fragColor = vec4( .0 );
            }`
        );

        // set the data for drawing the base square from 2 triangles with pass through vertex shader
        this._setShader('VERTEX_SHADER',
            `#version 300 es
            in vec2 position;
            
            void main() {
                gl_Position = vec4( position.x, position.y, 1.0, 1.0 );
            }`
        );

        let positionAttributeLocation = this._setVertexAttribute("position", [
            -1,  -1,
            -1,   1,
            1 ,   1,
            -1,  -1,
            1 ,   1,
            1 ,  -1
        ]);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);


        // finally do the normal rendering steps
        this.componentDidUpdate();
    }

    shouldComponentUpdate(nextProps, nextState) {
        let update =  nextProps.shader !== this.fragment_shader_code_try;
        this.fragment_shader_code_try = this.props.shader;
        return update;
    }

    componentDidUpdate() {
        let gl = this.gl;

        // update the fragmentshader if needed
        this._setShader('FRAGMENT_SHADER', this.props.shader);


        // set the canvas and the viewport size
        gl.viewport(0, 0, this.props.width, this.props.height);
        gl.canvas.width = this.props.width;
        gl.canvas.height = this.props.height;

        // really do the rendering
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(this.program);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

// low level util functions
    _setShader(type, shaderCode) {
        let gl = this.gl;
        let shaderCodeRef = type.toLowerCase() + '_code';
        let shaderRef = type.toLowerCase();

        if (this[shaderCodeRef] !== shaderCode) {
            try {
                let newShader = this._createShader(type, shaderCode);
                try {
                    gl.detachShader(this.program, this[shaderRef]);
                    gl.deleteShader(this[shaderRef])
                } catch (ignore) {}
                this[shaderRef] = newShader;

                gl.attachShader(this.program, this[shaderRef]);
                gl.linkProgram(this.program);

                this[shaderCodeRef] = shaderCode;
                this.compilerCallback('');
            } catch (compilerError) {
                this.compilerCallback(compilerError)
            }
        }
    }
    _createShader(type, source) {
        let gl = this.gl;

        let shader = gl.createShader(this._getGlConst(type));
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

        if (success) {
            return shader;
        } else {
            let error = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw error;
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
}
