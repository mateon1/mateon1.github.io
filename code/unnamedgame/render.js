/*jshint bitwise: true, camelcase: true, curly: true, eqeqeq: true, es3: true, forin: true, freeze: true, immed: true, latedef: true, newcap: true, noarg: true, noempty: true, nonbsp: true, nonew: true, plusplus: true, quotmark: double, undef: true, unused: strict, strict: true, browser: true, maxparams: 8, maxdepth: 4, maxstatements: 20, maxlen: 80*/
/*global define */

define("render", ["constants"], function (CONST) {
    "use strict";
    
    var canvas, ctx, bufferCanvas, bufferCtx,
        ready = false,
        onready = [],
        sprites = {},
        lastSprite = 0;
    
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
    
    
    var colorPixel = bufferCtx.createImageData(1, 1),
        colorCache;
    function parseColor(color) {
        var r = 255, g = 0, b = 255; // Debug pink by default
        
        if (color instanceof Array) {
            r = color[0];
            g = color[1];
            b = color[2];
        }
        
        if (r === colorCache[0] &&
            g === colorCache[1] &&
            b === colorCache[2]) {
            /* Use a cache, we don't want to repeatedly
             * parse large amounts of data */
            return colorPixel;
        }
        
        colorPixel.data[0] = r;
        colorPixel.data[1] = g;
        colorPixel.data[2] = b;
        colorPixel.data[3] = 255;
        
        colorCache = [r, g, b];
        
        return colorPixel;
    }
    
    // Commenting out for now - fillRect is more efficient.
    /*function rectangify(width, height, colorData) {
        var rect = bufferCtx.createImageData(width, height),
            len = width * height * 4;
        for (var i = 0; i < len; i += 4) {
            rect.data[i + 0] = colorData.data[0];
            rect.data[i + 1] = colorData.data[1];
            rect.data[i + 2] = colorData.data[2];
            rect.data[i + 3] = colorData.data[3];
        }
        return rect;
    }*/
    
    this.isReady = function () {return ready; };
    
    this.setPixel = function (x, y, color) {
        /**
         * params:
         * - x, y - Pixel coordinates
         * - color - Color - an [r, g, b] value array
         */
        var pixel = parseColor(color);
        bufferCtx.putImageData(pixel, x, y);
    };
    
    this.newSprite = function (w, h) {
        var id = lastSprite,
            sprite = {
                image: bufferCtx.createImageData(w, h),
                id: id,
                width: w,
                height: h
            };
        lastSprite += 1;
        sprites[id] = sprite;
        return sprite;
    };
    
    this.flushSprite = function (spriteId) {
        var canvas = document.createElement("canvas"),
            sprite = sprites[spriteId];
        canvas.width = sprite.width;
        canvas.height = sprite.height;
        canvas.getContext("2d").putImageData(sprite.image, 0, 0);
        sprite.flushed = canvas;
    };
    
    this.drawSprite = function (x, y, spriteId) {
        var sprite = sprites[spriteId];
        if (sprite.flushed) {
            bufferCtx.drawImage(sprite.flushed, x, y);
        } else {
            bufferCtx.putImageData(sprite.image, x, y);
        }
        
    };
    
    this.drawRect = function (x, y, w, h, color) {
        //var pixel = parseColor(color),
        //    rect = rectangify(w, h, pixel);
        //bufferCtx.putImageData(rect, x, y);
        bufferCtx.fillStyle = "rgb(" + color[0] + ", " +
                                       color[1] + ", " +
                                       color[2] + ")";
        bufferCtx.fillRect(x, y, w, h);
    };
    
    document.addEventListener("DOMContentLoaded", function () {
        canvas = document.getElementById("gamecanvas");
        ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        setReady();
    });
});