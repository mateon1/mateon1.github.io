/*jshint bitwise: true, camelcase: true, curly: true, eqeqeq: true, es3: true, forin: true, freeze: true, immed: true, latedef: true, newcap: true, noarg: true, noempty: true, nonbsp: true, nonew: true, plusplus: true, quotmark: double, undef: true, unused: strict, strict: true, browser: true, maxparams: 4, maxdepth: 4, maxstatements: 20, maxcomplexity: 5, maxlen: 80*/
/*global define */

define("render", ["constants"], function (CONST) {
    "use strict";
    
    var canvas, ctx, bufferCanvas, bufferCtx,
        ready = false,
        onready = [];
    
    bufferCanvas = document.createElement("canvas");
    bufferCanvas.width = 800 / CONST.SCALE;
    bufferCanvas.height = 600 / CONST.SCALE;
    bufferCtx = bufferCanvas.getContext("2d");
    bufferCtx.imageSmoothingEnabled = false;
    
    onready.push(function () {
        function renderLoop() {
            /* Call requestAnimationFrame before running other code
             * in case of exceptions */
            requestAnimationFrame(renderLoop);
            
            onFrame();
        }
        
        requestAnimationFrame(renderLoop);
    });
    
    function flushDisplay() {
        ctx.clearRect(0, 0, 800, 600);
        ctx.drawImage(bufferCanvas, 0, 0, 800, 600);
    }
    
    function onFrame() {
        flushDisplay();
    }
    
    function setReady() {
        if (ready) {return; }
        ready = true;
        onready.forEach(function (callback) {
            callback();
        });
    }
    
    var colorPixel = bufferCtx.createImageData(1, 1);
    function parseColor(color) {
        var charsPerChannel = (color.length - 1) / 3,
            r = color.slice(1, charsPerChannel + 1),
            g = color.slice(charsPerChannel + 1, charsPerChannel * 2 + 1),
            b = color.slice(charsPerChannel * 2 + 1);
        
        if (charsPerChannel === 1) {
            r = parseInt(r + r, 16);
            g = parseInt(g + g, 16);
            b = parseInt(b + b, 16);
        } else if (charsPerChannel === 2) {
            r = parseInt(r, 16);
            g = parseInt(g, 16);
            b = parseInt(b, 16);
        } else {
            r = parseInt(r.slice(0, 2), 16);
            g = parseInt(g.slice(0, 2), 16);
            b = parseInt(b.slice(0, 2), 16);
        }
        
        colorPixel.data[0] = r;
        colorPixel.data[1] = g;
        colorPixel.data[2] = b;
        colorPixel.data[3] = 255;
        
        return colorPixel;
    }
    
    this.isReady = function () {return ready; };
    
    this.setPixel = function (x, y, color) {
        /**
         * params:
         * - x, y - Pixel coordinates
         * - color - Color in the format #rgb or #rrggbb
         */
        var pixel = parseColor(color);
        bufferCtx.putImageData(pixel, x, y);
    };
    
    document.addEventListener("DOMContentLoaded", function () {
        canvas = document.getElementById("gamecanvas");
        ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        setReady();
    });
});