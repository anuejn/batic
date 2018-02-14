/**
 * @file creates an app with managed state similar to the Elm concept
 */
"use strict";

export default class ElmStyleApp {
    constructor(initialModel, update, view, lower, debug = true) {
        this._model = initialModel;
        this.e = async function (e) {
            const next_e = await update(this._model, e);
            if (debug) {
                console.log(this._model);
            }


            lower(await view(this._model));


            if (next_e) {
                this.e(next_e);
            }
        };

        this.e('initial');
    }
}
