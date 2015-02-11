(function debugUtilsIIFE(window) {
    "use strict";
    
    var INSPECT_DEFAULT_DEPTH = 3,
        INSPECT_DEFAULT_INDENT = 2, // 1 or greater
        INSPECT_DEFAULT_LONGSTR = 90,
        TAB_WIDTH = 4,
        
        OBJECT = {}.constructor,
        ARRAY = [].constructor,
        
        undef = (function getUndefined() {}());
    
    function repeatStr(str, n) {
        return (new ARRAY(n + 1)).join(str);
    }
    
    function zeroPad(n, s) {
        return repeatStr("0", Math.max(n - s.length, 0)) + s;
    }
    
    function stringRepr(str) {
        var result = ['"'];
        for (var i = 0; i < str.length; i++) {
            var c = str[i].charCodeAt(0);
            if (c < 32 || c > 127) {
                switch (c) {
                    case 13:
                        result.push("\\r");
                        break;
                    case 12:
                        result.push("\\f");
                        break;
                    case 11:
                        result.push("\\v");
                        break;
                    case 10:
                        result.push("\\n");
                        break;
                    case 9:
                        result.push("\\t");
                        break;
                    case 8:
                        result.push("\\b");
                        break;
                    case 0:
                        result.push("\\0");
                        break;
                    default:
                        result.push("\\u" + zeroPad(4, c.toString(16)));
                }
            } else {
                if (c === 92 || c === 34) { // backslash || double quote
                    result.push("\\");
                }
                result.push(str[i]);
            }
        }
        result.push('"');
        return result.join("");
    }
    
    function tabsToSpaces(str) {
        return (str.split("\n").map(function ttsLineFunc(el) {
            return el.split("\t").reduce(function ttsTabFunc(last, now) {
                var tabbiness = last.length % TAB_WIDTH || TAB_WIDTH;
                return last + repeatStr(" ", tabbiness) + now;
            });
        })).join("\n");
    }
    
    function fixIndentation(func) {
        func = tabsToSpaces("" + func);
        var lastIndent = (/[^\n\S]*}$/).exec(func)[0].length - 1;
        return func.replace(/^[^\n\S]+/gm, function indentFunc(match) {
            return match.slice(lastIndent);
        });
    }
    
    function indentOne(text, spaces) {
        if (typeof spaces != "number") {spaces = TAB_WIDTH; }
        return text.replace(/^/gm, repeatStr(" ", spaces));
    }
    
    function inspect(object, settings) {
        if (!settings) {settings = {}; }
        var maxDepth = settings.maxDepth,
            indent = settings.indent || INSPECT_DEFAULT_INDENT,
            functions = settings.functions,
            longstr = settings.longstr || INSPECT_DEFAULT_LONGSTR;
        if (maxDepth === undef) {maxDepth = INSPECT_DEFAULT_DEPTH; }
        if (functions === undef) {functions = false; }
        
        function inspMapRepr(obj, depth) {
            var keys = OBJECT.keys(obj);
            if (keys.length === 0) {
                return "{}";
            } else if (depth < 0) {
                return "{...}";
            }
            
            return "{" + indentOne(keys.reduce(function inspMapEnum(arr, key) {
                var inner = inspectProp(obj, key, depth);
                if (inner.indexOf("\n") !== -1) {
                    return arr.concat(key + ":\n" +
                                      repeatStr(" ", indent) + inner);
                }
                return arr.concat(key + ": " + inner);
            }, []).join(",\n"), indent).slice(1) + "}";
        }
        
        function inspArrRepr(arr, depth) {
            if (arr.length === 0) {
                return "[]";
            } else if (depth < 0) {
                return "[...]";
            }
            
            var inspd = [];
            
            for (var i = 0; i < arr.length; i++) {
                inspd.push(inspectProp(arr, i));
            }
            
            if (!inspd.reduce(function hasNewlines(last, now) {
                return last || now.indexOf("\n") !== -1;
            }, false) && inspd.join(", ").length < 70) {
                // no newlines and short
                return "[" + inspd.join(", ") + "]";
            }
            
            return "[" + indentOne(inspd.join(",\n"), indent).slice(1) + "]";
        }
        
        function inspectProp(obj, key, depth) {
            var origobj = obj;
            if (!(key in obj)) {
                return "<ERROR: Nonexistent property>";
            }
            while (!obj.hasOwnProperty(key)) {
                obj = OBJECT.getPrototypeOf(obj);
                if (!(key in obj)) {
                    return "<ERROR: Nonexistent property>";
                }
            }
            var descriptor = OBJECT.getOwnPropertyDescriptor(obj, key);
            
            if ("value" in descriptor) {
                try {
                    return inspectInner(descriptor.value, depth);
                } catch (e) {
                    return "<" + e.name + ": " + e.message + ">";
                }
            } else if (descriptor.get) {
                return "<getter, be careful!>";
            } else if (descriptor.set) {
                console.log("WRITE ONLY DETECTED!!", origobj, key, descriptor);
                return "<write-only, what the f*ck?>";
            }
            console.log("WRONGNESS!", origobj, key, descriptor);
            return "<I don't know what went wrong :(>";
        }
        
        function inspectInner(obj, depth) {
            var type = typeof obj,
                realType = OBJECT.prototype.toString.call(obj).slice(8, -1);
            if (type === "string") {
                var r = stringRepr(obj);
                return "[primitive <string>: " +
                        (r.length > longstr ? r.length + " char..." : r) + "]";
            } else if (type === "function") {
                if (functions) {
                    return "[primitive <function>:\n" +
                                indentOne(fixIndentation(obj) + "]");
                }
                return "[primitive <function>: " +
                    (/^function \w*\([^\)]*\)/).exec("" + obj)[0] + " {...}]";
            } else if (type !== "object") {
                return "[primitive <" + typeof obj + ">: " + obj + "]";
            } else if (obj === null) {
                return "[primitive <object>: null]";
            }
            
            var keys = OBJECT.keys(obj);
            
            if (keys.filter(/./.test.bind(/^[\s\S]*\D+[\s\S]*$/)).length > 0) {
                var repr = inspMapRepr(obj, depth - 1);
                if (repr.indexOf("\n") === -1) {
                    return "[<" + realType + ">: " + repr + "]";
                }
                return "[<" + realType + ">:\n" +
                            indentOne(repr + "]", indent);
            }
            
            if (realType === "Array" || obj.length !== undef) {
                return inspArrRepr(obj, depth - 1);
            }
            
            var s = "" + obj;
            if (s.length > 0 && stringRepr(s).length < longstr) {
                return "[<" + realType + ">: " + stringRepr(s) + "]";
            }
            return "[<" + realType + ">]";
        }
        
        return inspectInner(object, maxDepth);
    }
    
    window.debugUtils = {
        "undefined"     : undef,
        "inspect"       : inspect,
        "repeatStr"     : repeatStr,
        "zeroPad"       : zeroPad,
        "stringRepr"    : stringRepr,
        "tabsToSpaces"  : tabsToSpaces,
        "fixIndentation": fixIndentation,
        "indentOne"     : indentOne};
}(this));
