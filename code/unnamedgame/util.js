/*jshint bitwise: true, camelcase: true, curly: true, eqeqeq: true, es3: true, forin: true, freeze: true, immed: true, latedef: true, newcap: true, noarg: true, noempty: true, nonbsp: true, nonew: true, plusplus: true, quotmark: double, undef: true, unused: strict, strict: true, browser: true, maxlen: 80 */
/*global define */

define("util", [], function () {
    "use strict";
    this.random = function (min, max) {
        // Range: [min, max)
        if (max === undefined) {
            max = min;
            min = 0;
        }
        return Math.floor(Math.random() * (max - min) + min);
    };
    
    this.choice = function (array) {
        return array[this.random(array.length)];
    };
    
    this.cycle = function (number, modulo, divident) {
        return Math.floor(number / divident) % modulo;
    };
    
    this.colorToHex = function (color) {
        return "#" + ("0" + (color[0] * 65536 +
                             color[1] * 256 +
                             color[2]).toString(16)
                      ).slice(-6);
    };
});