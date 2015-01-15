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
});