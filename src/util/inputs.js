/**
 * @file a collection of various inputs for glsl types
 */
"use strict";

module.exports = [
    {
        type: ['float'],
        render: (name) => `
            <label>${name} <input type="range" min="0" max="1" value="0.5" step="0.000001" class="slider" id="slider_${toId(name)}"></label>
        `,
        val: (name) => ['FLOAT', document.getElementById('slider_' + toId(name)).value]
    },

    {
        type: ['sampler2D'],
        render: (name) => `<label>${name} <input type="file"></label>`,
        val: (name) => ['FLOAT', document.getElementById('slider_' + toId(name)).value]
    }
];


function toId(str) {
    return str.replace(/[^a-z]/ig, '');
}
