/**
 * @file a wrapper around the ace edior for glsl editing
 */
"use strict";

import React from "react";

import brace from 'brace';
import 'brace/ext/language_tools';
import AceEditor from 'react-ace';
import 'brace/mode/glsl';
import 'brace/theme/github';


export default class GlslEditor extends React.Component {
    constructor() {
        super();

        this.state = {
            val: ''
        };
    }

    render() {
        return <AceEditor
            mode="glsl"
            theme="github"
            name="code"
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                showLineNumbers: true,
                tabSize: 4,
                $blockScrolling: true,
            }}

            value={this.props.value}
            onChange={this.props.onChange}

            fontSize={16}
            highlightActiveLine={true}
        />
    }
}