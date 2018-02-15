/**
 * @file
 * the main entrypoint for the gui. glues everything together.
 */
"use strict";

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';


window.addEventListener('load', () => {
    ReactDOM.render(<App />, document.getElementById('react'));
});
