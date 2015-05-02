window.addEventListener("DOMContentLoaded", function initMagic() {
    "use strict";
    
    var SQRT_3 = Math.sqrt(3),
        //SQRT_2 = Math.SQRT2,
        COLORS = ["#FF0000", "#00FF00", "#0040FF"],
        RENDERIN = 2800,
        
        canvas, ctx,
        iteramount = 1,
        instantdraw = false;
    
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    
    // alias for truncate
    function t(n) {
        return Math.floor(n);
    }
    
    function drawBaseTriangle() {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        ctx.moveTo(400, 0);
        ctx.lineTo(0, t(400 * SQRT_3));
        ctx.lineTo(800, t(400 * SQRT_3));
        ctx.lineTo(400, 0);
        ctx.stroke();
    }
    
    function renderOne(data) {
        ctx.beginPath();
        ctx.strokeStyle = data[4];
        ctx.lineWidth = 2;
        ctx.moveTo(data[0], data[1]);
        ctx.lineTo(data[2], data[3]);
        ctx.stroke();
    }
    
    var queue = [];
    
    function queueRender(instant) {
        var total = queue.length;
        var rin = Math.min(RENDERIN, total * 100);
        if (instant) {
            while (queue.length) {
                renderOne(queue.shift());
            }
            drawBaseTriangle();
        } else {
            var start = Date.now();
            window.requestAnimationFrame(function renderLoop() {
                var now = Date.now();
                var frac = (now - start) / rin;
                if (frac > 1) {
                    return queueRender(true);
                }
                var expected = (1 - frac) * total;
                while (queue.length > expected) {
                    renderOne(queue.shift());
                    if (queue.length === 0) {
                        return drawBaseTriangle();
                    }
                }
                drawBaseTriangle();
                if (queue.length) {
                    window.requestAnimationFrame(renderLoop);
                }
            });
        }
    }
    
    function generate(iters, instant) {
        drawBaseTriangle();
        var x1, x2, x3,
            y1, y2, y3;
        for (var i = 0; i < iters; i++) {
            x1 = t((i + 1) * 800 / (iters + 1));
            y1 = t(400 * SQRT_3);
            x2 = t(800 - 400 * (i + 1) / (iters + 1));
            y2 = t(400 * SQRT_3 - 400 * SQRT_3 * (i + 1) / (iters + 1));
            x3 = t(400 - 400 * (i + 1) / (iters + 1));
            y3 = t(400 * SQRT_3 * (i + 1) / (iters + 1));
            queue.push([x1, y1, x2, y2, COLORS[0]]);
            queue.push([x2, y2, x3, y3, COLORS[1]]);
            queue.push([x3, y3, x1, y1, COLORS[2]]);
        }
        
        queueRender(instant);
    }
    
    drawBaseTriangle();
    
    document.getElementById("generate").addEventListener("click", function () {
        iteramount = parseInt(document.getElementById("triangleiters").value, 10);
        instantdraw = document.getElementById("insta").checked;
        window.cancelAnimationFrame(window.requestAnimationFrame(function(){}) - 1);
        ctx.clearRect(0, 0, 800, 800);
        generate(iteramount, instantdraw);
    });
    
});
