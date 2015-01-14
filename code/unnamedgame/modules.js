/*jshint bitwise: true, camelcase: true, curly: true, eqeqeq: true, es3: true, forin: true, freeze: true, immed: true, latedef: true, newcap: true, noarg: true, noempty: true, nonbsp: true, nonew: true, plusplus: true, quotmark: double, undef: true, unused: strict, strict: true, browser: true, maxlen: 80 */
(function (window) {
    "use strict";
    var modules = {},
        loaded = [];
    
    function checkModule(name) {
        var module = modules[name],
            satisfied;
        
        satisfied = module.dependencies.reduce(function (last, depencency) {
            return last && loaded.indexOf(depencency) !== -1;
        }, true);
        
        if (satisfied) {
            module.module = {};
            module.func.apply(module.module, module.dependencies.map(
                function (name) {
                    return modules[name].module;
                }));
            if (name.indexOf("#require#") !== 0) {
                loaded.push(name);
            } else {
                delete modules[name];
            }
        }
        
        return satisfied;
    }
    
    function checkModules() {
        var anySatisfied;
        do {
            anySatisfied = false;
            for (var module in modules) {
                if (modules.hasOwnProperty(module) &&
                    loaded.indexOf(module) === -1) {
                    anySatisfied = checkModule(module) ? true : anySatisfied;
                }
            }
        } while (anySatisfied);
    }
    
    function define(name, dependencies, func) {
        modules[name] = {
            dependencies: dependencies,
            func: func,
            module: null};
        checkModules();
    }
    
    var nextRequireId = 0;
    function require(dependencies, func) {
        var name = "#require#" + nextRequireId;
        nextRequireId += 1;
        modules[name] = {
            dependencies: [].concat(dependencies),
            func: func};
        checkModule(name);
    }
    
    
    window.require = require;
    window.define = define;
}(this));