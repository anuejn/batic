/**
 * @file
 * the main entrypoint for the gui. glues everything together.
 */
"use strict";

/*
const shader_preprocessor = require('./shader_preprocessor');

const panzoom = require('../lib/panzoom/panzoom.min.js');
const ace = require('../lib/ace/lib/ace/ace');


const initialModel = {
    globalError: null,

    fragment_shader: null,
    compiler_errors: '',

    inputs: {},
};

async function update(model, e) {
    if(e === 'initial') {
        return 'load_shader';
    } else if (e === 'load_shader') {
        model.fragment_shader = await loaders.loadText("examples/shaders/black_white.glsl");
        return 'load_resources';
    } else if (e === 'load_resources') {
        model.inputs['raw_image'] = await loaders.loadRaw16("examples/images/human.raw16");
    } else if (typeof e === error) {
        model.globalError = e.me
    }
}

async function view(model) {
    if(!model.fragment_shader) {
        return `
            <div id="loading">
                LOADING SHADER...
            </div>
        `;
    } else if (Object.keys(shader_preprocessor.getRequiredInputs(model.fragment_shader)).filter(x => !model.inputs[x]).length > 0) {
        return `
            <div id="loading">
                LOADING RESOURCES...
            </div>
        `;
    } else {
        return `
            <main>
                <canvas id="canvas"></canvas>
            </main>
        
            <aside>
                <h1>### BATIC </h1>
                <a href="https://github.com/anuejn/batic" target="_blank" style="position: absolute; right: 20px; top: 40px;">(WHATS THIS?!)</a>
        
                <div id="controls">
                    ${generateControls(model.fragment_shader)}
                </div>
                <div id="code"></div>
                <pre id="errors">
                    ${model.compiler_errors}
                </pre>
            </aside>
        `;
    }
}

function generateControls(fragment_shader) {
    const needed_inputs = shader_preprocessor.getRequiredInputs(fragment_shader);
    return Object.keys(needed_inputs).map(name => {
        try {
            let input = inputs.filter(i => i.type.indexOf(needed_inputs[name]) !== -1)[0];
            console.log(input.render(name));
            return input.render(name);
        } catch (e) {
            return `<div class="error">no input for uniform ${name} with type ${needed_inputs[name]}`
        }
    }).reduce((a, b) => a + b);
}

async function lower(rendered) {
    const container = document.querySelector("body");
    if(rendered !== container.innerHTML) {
        // set the html
        container.innerHTML = rendered;


        // setup the code editor
        window.code = ace.edit("code");
        window.code.session.setMode("ace/mode/glsl");
        ace.require("ace/ext/language_tools");
        window.code.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });

        // setup panzoom
        let scene = document.getElementById("canvas");
        panzoom(scene, {
            smoothScroll: true
        })

    }
}
*/

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const App = () => (
    <div className="App">
        <h1 className="App-Title">Hello Parcel x React</h1>
    </div>
);


window.addEventListener('load', () => {
    ReactDOM.render(<App />, document.getElementById('react'));
});
