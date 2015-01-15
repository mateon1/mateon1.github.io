/*jshint bitwise: true, camelcase: true, curly: true, eqeqeq: true, es3: true, forin: true, freeze: true, immed: true, latedef: true, newcap: true, noarg: true, noempty: true, nonbsp: true, nonew: true, plusplus: true, quotmark: double, undef: true, unused: strict, strict: true, browser: true, maxlen: 80 */
/*global require */

require(["util", "render", "constants"], function (util, render, CONST) {
    "use strict";
    function randomColor() {
        return [util.random(256), util.random(256), util.random(256)];
    }
    
    var frameCounter = 0,
        coindata = {
            palette: [[0x00, 0x00, 0x00, 0x00],     // transparent
                      [0x00, 0x00, 0x00, 0xFF],     // black
                      [0xD8, 0xA0, 0x38, 0xFF],     // dark gold
                      [0xF8, 0xD8, 0x20, 0xFF],     // gold
                      [0xF8, 0xF8, 0x00, 0xFF],     // bright gold
                      [0xE8, 0xF0, 0xF8, 0xFF]],    // white-ish
            frames: [
                [ // Doing this by hand is painful, but works...
                    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 5, 5, 5, 5, 1, 1, 0, 0, 0, 0],
                    [0, 0, 0, 1, 5, 5, 3, 3, 3, 3, 3, 2, 1, 0, 0, 0],
                    [0, 0, 0, 1, 5, 3, 4, 5, 5, 4, 3, 2, 1, 0, 0, 0],
                    [0, 0, 1, 5, 3, 4, 5, 4, 3, 1, 4, 3, 2, 1, 0, 0],
                    [0, 0, 1, 5, 3, 4, 5, 4, 3, 1, 4, 3, 2, 1, 0, 0],
                    [0, 0, 1, 5, 3, 4, 5, 4, 3, 1, 4, 3, 2, 1, 0, 0],
                    [0, 0, 1, 5, 3, 4, 5, 4, 3, 1, 4, 3, 2, 1, 0, 0],
                    [0, 0, 1, 5, 3, 4, 5, 4, 3, 1, 4, 3, 2, 1, 0, 0],
                    [0, 0, 1, 5, 3, 4, 5, 4, 3, 1, 4, 3, 2, 1, 0, 0],
                    [0, 0, 1, 5, 3, 4, 5, 3, 3, 1, 4, 3, 2, 1, 0, 0],
                    [0, 0, 1, 5, 3, 4, 5, 3, 3, 1, 4, 3, 2, 1, 0, 0],
                    [0, 0, 0, 1, 3, 4, 4, 1, 1, 4, 3, 2, 1, 0, 0, 0],
                    [0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 2, 2, 1, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0]],
                [
                    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 1, 5, 5, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 5, 3, 3, 2, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 5, 4, 4, 2, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 5, 3, 5, 1, 3, 2, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 5, 3, 5, 1, 3, 2, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 5, 3, 5, 1, 3, 2, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 5, 3, 5, 1, 3, 2, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 5, 3, 5, 1, 3, 2, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 5, 3, 5, 1, 3, 2, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 5, 3, 5, 1, 3, 2, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 5, 3, 5, 1, 3, 2, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 3, 4, 4, 2, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 3, 3, 3, 2, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]],
                [
                    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 1, 5, 5, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 1, 4, 4, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 4, 4, 3, 2, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 1, 4, 4, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]]
            ],
            frameorder: [0, 1, 2, 1]
        };
    function genCoin(sprite, n) {
        var arr = sprite.image.data,
            layout = coindata.frames[n];
        
        for (var y = 0, i = 0; y < layout.length; y += 1) {
            for (var x = 0; x < layout[0].length; x += 1, i += 4) {
                var color = coindata.palette[layout[y][x]];
                arr[i + 0] = color[0];
                arr[i + 1] = color[1];
                arr[i + 2] = color[2];
                arr[i + 3] = color[3];
            }
        }
        
        render.flushSprite(sprite.id);
    }
    
    function drawCoin(x, y, frame) {
        var sprite = [coin0, coin1, coin2][coindata.frameorder[util.cycle(frame, 4, 7)]];
        
        render.drawSprite(x, y, sprite.id);
    }
    
    var coin0 = render.newSprite(16, 16),
        coin1 = render.newSprite(16, 16),
        coin2 = render.newSprite(16, 16);
    
    genCoin(coin0, 0);
    genCoin(coin1, 1);
    genCoin(coin2, 2);
    
    function draw() {
        
        render.drawRect(0, 0, 800 / CONST.SCALE, 600 / CONST.SCALE,
                        CONST.SKY_COLOR);
        
        for (var y = 0; y < 600 / CONST.SCALE - 16; y += 16) {
            for (var x = 0; x < 800 / CONST.SCALE - 16; x += 16) {
                drawCoin(x, y, frameCounter);
            }
        }
        frameCounter += 1;
    }
    
    draw();
    
    function renderLoop() {
        requestAnimationFrame(renderLoop);
        
        draw();
    }
    
    requestAnimationFrame(renderLoop);
});