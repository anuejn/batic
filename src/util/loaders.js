/**
 * @file
 * load different kind of data as promises
 */
"use strict";


module.exports = new class loaders {
    /**
     * load apertus raw12 images into a float32 array
     * @param url
     * @returns {Promise<Float32Array>}
     */
    loadRaw12(url) {  // TODO: this function is not working!
        return new Promise(resolve => {
            let req = new XMLHttpRequest();
            req.open("GET", url, true);
            req.responseType = "arraybuffer";

            req.onload = e => {
                const max_12b = Math.pow(2, 12);
                let bytes = new Uint8Array(req.response, 0);

                let out = new Float32Array(4096 * 4096);
                let out_pointer = 0;
                for (let i = 0; out_pointer + 2 < out.length; i++) {
                    let b1 = bytes[i + 0];
                    let b2 = bytes[i + 1];
                    let b3 = bytes[i + 2];

                    out.set([((b1 << 4) + (b2 >> 4)) / max_12b, (((b2 << 8) % 255) + b3) / max_12b], out_pointer);
                    out_pointer += 2;
                }
                resolve(out)
            };

            req.send(null);
        });
    }

    /**
     * load apertus raw16 images into a float32 array
     * @param url
     * @returns {Promise<Float32Array>}
     */
    loadRaw16(url) {
        return new Promise(resolve => {
            let req = new XMLHttpRequest();
            req.open("GET", url, true);
            req.responseType = "arraybuffer";

            req.onload = e => {
                const max_12b = Math.pow(2, 16);
                let int16 = new Uint16Array(req.response, 0);

                let out = Float32Array.from(int16, x => x / max_12b);
                resolve(out)
            };

            req.send(null);
        });
    }

    /**
     * load text - for example shader code as a promise
     * @param url
     * @returns {Promise<String>}
     */
    loadText(url) {
        return new Promise(resolve => {
            let req = new XMLHttpRequest();
            req.open("GET", url);

            req.onload = e => {
                resolve(req.responseText);
            };

            req.send(null);
        })
    }
};
