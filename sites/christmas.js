var width = 320;
var height = 445;

var row = 11;
var col = 12;

var topMost = height / 8;
var downMost = height / 30;
var leftMost = width / 45;

var treeWidth = Math.round((width - leftMost) / row);
var treeHeight = Math.round((height - topMost - downMost) / col);

var canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

var ctx = canvas.getContext('2d');

ctx.font="12px monospace";

var white = "rgb(255,255,255)";
var green = "rgb(0,255,0)";
var red = "rgb(255,0,0)";

var leaves = [ "`", "^", "~", "^", ".", "^"];
var decors = ["+", "*", "o", ".", "*", "+"];
var decorColors = [red, white, white, white];

var darkness = 255;

var snows = ["`", "'", "*", "`", "'", "."];

var numSnowFlakes = 120;


function randomInt(min, max) {
    return Math.floor(Math.random() * (max-min+1) + min);
}

function drawDecor() {
   return (randomInt(0,10) >= 7);
}

function drawSnowFlakeOnTree() {
   return (randomInt(0,20) >= 17);
}

function genTree() {
    var tree = new Array(treeHeight);

    var options = new Array(leaves.length + decors.length);

    for (var i = 0; i < options.length; i++)
        options[i] = i;

    for (var i = 0; i < tree.length; i++) {
        tree[i] = new Array(treeWidth);
        for (var j = 0; j < tree[i].length; j++) {
            var midPoint = treeWidth / 2;
            var halfSize = (i / treeHeight) * treeWidth / 2;
            if ((j < midPoint - halfSize) || (j > midPoint + halfSize))
               tree[i][j] = -2;
            else if (i < 2)
               tree[i][j] = options[randomInt(decors.length, options.length - 1)];
            else tree[i][j] = options[randomInt(0, options.length - 1)];
        }
    }

    return tree;
}

var tree = genTree();

function redrawBackground() {
    var img = ctx.getImageData(0, 0, width, height);
    for (var i = 0; i < width * height; i++) {
        img.data[4*i+0] = 0.3 * img.data[4*i+2];
        img.data[4*i+1] = 0.3 * img.data[4*i+0];
        img.data[4*i+2] = 0.3 * img.data[4*i+1];
        img.data[4*i+3] = darkness;
    }
    ctx.putImageData(img, 0, 0);
}

function drawTree() {

    redrawBackground();

    for (var i = 0; i < tree.length; i++)
        for (var j = 0; j < tree[i].length; j++) {
            d = tree[i][j];
            if (d >= decors.length) {
                var leaf = d - decors.length;
                ctx.fillStyle = green;
                ctx.fillText(leaves[leaf][0], leftMost + j * row, topMost + i * col);
            }
            if ((d >= 0) && (d < decors.length) && drawDecor()) {
                var item = decors[randomInt(0, decors.length - 1)];
                ctx.fillStyle = decorColors[randomInt(0, decorColors.length - 1)];
                ctx.fillText(item, leftMost + j * row, topMost + i * col);
            }
        }

    ctx.fillStyle = white;
    ctx.fillText("Merry Christmas and Happy New Year 2017!!", 15, height - 10);
}

function drawOneSnowFlake(x, y) {
    ctx.fillStyle = white;
    var item = snows[randomInt(0, snows.length - 1)];
    ctx.fillText(item, x, y);
}

function drawSnow() {

    var img = ctx.getImageData(0, 0, width, height);
    for (var i = 0; i < width * height; i++) {
        var x = i % width;
        var y = i / width;
        var midPoint = width / 2;
        var halfSize = (width / 2) * (y - topMost) / (height - topMost);
        var leftBound = midPoint - halfSize - 2;
        var rightBound = midPoint + halfSize + 2;
        if ((y <= topMost) || (x < leftBound) || (x > rightBound)) {
            img.data[4*i+0] = 0.2 * img.data[4*i+0];
            img.data[4*i+1] = 0.2 * img.data[4*i+1];
            img.data[4*i+2] = 0.2 * img.data[4*i+2];
            img.data[4*i+3] = darkness;
        }
        else {
            img.data[4*i+0] = img.data[4*i+0];
            img.data[4*i+1] = img.data[4*i+1];
            img.data[4*i+2] = img.data[4*i+2];
            img.data[4*i+3] = img.data[4*i+3];
        }
    }
    ctx.putImageData(img, 0, 0);

    for (var i = 0; i < numSnowFlakes; i++)  {
        var x = randomInt(10, width - 10);
        var y = randomInt(10, height - 10);
        var midPoint = width / 2;
        var halfSize = (width / 2) * (y - topMost) / (height - topMost);
        var leftBound = midPoint - halfSize - 2;
        var rightBound = midPoint + halfSize + 2;
        if ((y <= topMost)
            || (y >= topMost + treeHeight * col)
            || (x < leftBound)
            || (x > rightBound)
            || (drawSnowFlakeOnTree()))
            drawOneSnowFlake(x, y);
        else {} // do nothing
    }
}

drawTree();

setInterval(drawTree, 1200);
setInterval(drawSnow, 150);
