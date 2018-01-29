/**
 * @file some helper functions for having talking with webgl
 */

module.exports = new class webgl_utils {
    createShader(gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

        if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
            document.getElementById("errors").innerHTML = gl.getShaderInfoLog(shader);
        } else {
            document.getElementById("errors").innerHTML = "";
        }

        if (success) {
            return shader;
        } else {
            gl.deleteShader(shader);
            return null;
        }
    }

    createProgram(gl, vertexShader, fragmentShader) {
        if(!fragmentShader) {
            return null;
        }
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
};
