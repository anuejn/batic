/**
 * @file
 * the main entrypoint for the gui. glues everything together.
 */
"use strict";

import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import FragmentShaderRenderer from './FragmentShaderRenderer';


const App = () => (
    <div className="App">
        <h1 className="App-Title">Hello Parcel x React</h1>
        <FragmentShaderRenderer width="100" height="100" compilerCallback={console.warn} shader={
            `#version 300 es
            precision mediump float;

            out vec4 fragColor;

            void main() {
                fragColor = vec4( 1. );
            }`
        }/>
    </div>
);


window.addEventListener('load', () => {
    ReactDOM.render(<App />, document.getElementById('react'));
});
