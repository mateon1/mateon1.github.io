/*jshint bitwise: true, camelcase: true, curly: true, eqeqeq: true, es3: true, forin: true, freeze: true, immed: true, latedef: true, newcap: true, noarg: true, noempty: true, nonbsp: true, nonew: true, plusplus: true, quotmark: double, undef: true, unused: strict, strict: true, browser: true, maxlen: 80 */
/*global define */

define("game", ["util", "render", "constants"],
       function (util, render, CONST) {
    "use strict";
    function randomColor() {
        return "#" + util.choice("0123456789ABCDEF") +
                     util.choice("0123456789ABCDEF") +
                     util.choice("0123456789ABCDEF");
    }
    
    for (var y = 0; y < 600 / CONST.SCALE; y += 1) {
        for (var x = 0; x < 800 / CONST.SCALE; x += 1) {
            render.setPixel(x, y, randomColor());
        }
    }
    
    function renderLoop() {
        requestAnimationFrame(renderLoop);
        
        for (var i = 0; i < 1000; i += 1) {
            render.setPixel(util.random(800 / CONST.SCALE),
                            util.random(600 / CONST.SCALE),
                            randomColor());
        }
    }
    
    requestAnimationFrame(renderLoop);
});