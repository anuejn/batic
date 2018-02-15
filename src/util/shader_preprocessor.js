/**
 * @file preprocesses shaders
 */
"use strict";

module.exports = new class shader_preprocessor {
    getRequiredInputs(shader) {
        let required_inputs = {};
        shader.replace(/uniform (.*) (.*);/g, (_, m1, m2) => required_inputs[m2] = m1);
        return required_inputs;
    }
};