/**
 * @file
 * the main entrypoint for the gui. glues everything together.
 */
"use strict";

let loaders = require('./loaders');
let webgl_util = require('./webgl_utils');

const size = {x: 4096, y: 3072};


main();
async function main() {
    const shader = await loaders.loadText("examples/shaders/black_white.glsl");
    const raw_image = await loaders.loadRaw16("examples/images/human.raw16");


    window.code.setValue(shader, -1);

    let redo = () => {
        generate_inputs(window.code.getSession().getValue());
        setup(window.code.getSession().getValue(), raw_image, size)
    };
    window.code.getSession().on('change', () => setTimeout(redo, 10)); // the setTimeout is for not slowing the editor down or throwing errors from the event handler

    document.getElementById("loading").style.display = "none";
    redo();
}

function generate_inputs(src) {
    let inputs = "";
    let input_values = get_inputs_values();
    src.replace(/uniform float (.*);/g, (_, x) => {inputs += `<label>${x} <input type="range" min="0" max="1" value="0.5" step="0.000001" class="slider" id="input_${x}"></label>\n`});
    document.querySelector("#controls").innerHTML = inputs;
    Object.keys(input_values).forEach(name => {
        document.getElementById("input_" + name).value = input_values[name];
    });
    Array.from(document.getElementsByTagName("input")).forEach(s => s.oninput = render)
}

function get_inputs_values() {
    let input_values = {};
    Array.from(document.getElementsByTagName("input")).forEach(slider => {
        input_values[slider.id.replace("input_", "")] = parseFloat(slider.value);
    });
    return input_values;
}


// the rendering section
let gl, program;
function setup(fragment_shader_code, raw_image, canvas_size) {
    // initialize webgl
    let canvas = document.getElementById("canvas");
    gl = canvas.getContext('webgl2');

    // define the code for the examples
    let vertex_shader_code =
        `#version 300 es
        in vec2 position;
        
        void main() {
            gl_Position = vec4( position.x, position.y, 1.0, 1.0 );
        }`;


    // compile the examples & the program
    let vs = webgl_util.createShader(gl, gl.VERTEX_SHADER, vertex_shader_code);
    let fs = webgl_util.createShader(gl, gl.FRAGMENT_SHADER, fragment_shader_code);

    program = webgl_util.createProgram(gl, vs, fs);
    if(!program) {
        return;
    }


    // draw the base square
    var positionAttributeLocation = gl.getAttribLocation(program, "position");
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = [
        -1, -1,
        -1, 1,
        1, 1,
        -1, -1,
        1, 1,
        1, -1
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionAttributeLocation);
    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var buffer_size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, buffer_size, type, normalize, stride, offset);



    gl.viewport(0, 0, size.x, size.y);
    gl.canvas.width = size.x;
    gl.canvas.height = size.y;



    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, size.x, size.y, 0, gl.RED, gl.FLOAT, raw_image);

    render();
}


function render() {
    // set up the params
    let vals = get_inputs_values();
    Object.keys(vals).forEach(val_name => {
        gl.useProgram(program);
        let loc = gl.getUniformLocation(program, val_name);
        gl.uniform1f(loc, vals[val_name]);
    });


    // really render
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
