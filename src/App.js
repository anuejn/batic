/**
 * @file the main react component of batic
 */
"use strict";

import React from 'react';

import './css/index.css';
import FragmentShaderRenderer from './FragmentShaderRenderer';
import GlslEditor from './GlslEditor'

export default class App extends React.Component{
    constructor() {
        super();

        this.state = {
            shader:"#version 300 es\nprecision mediump float;\n\nout vec4 fragColor;\n\nvoid main() {\n    fragColor = vec4( 1. );\n}",
            error: ''
        };
    }

    render() {
        return <div>
            <main>
                <FragmentShaderRenderer
                    width={100}
                    height={100}
                    compilerCallback={error => this.setState({error: error})}
                    shader={this.state.shader}
                />
            </main>
            <aside>
                <h1>### BATIC </h1>
                <a href="https://github.com/anuejn/batic" style={{
                    position: 'absolute',
                    right: '20px',
                    top: '40px'
                }}>(WHATS THIS?!)</a>

                <div id="controls"/>

                <GlslEditor
                    value={this.state.shader}
                    onChange={newShader => this.setState({shader: newShader})}
                />

                <pre id="errors">
                    {this.state.error}
                </pre>
            </aside>
        </div>
    }
}