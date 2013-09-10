function drawSinus(view, f) {
  var width = view.canvas.width;
  var height = view.canvas.height;
  view.moveTo(0, height/2);
  for(var i = -width/2; i * 30 < width/2; i+=0.2) {
    view.lineTo(width/2 + i * 30, height/2 + -f(i) * 100);
  }
}

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

function drawAxes(view) {
  var height = view.canvas.height;
  var width = view.canvas.width;
  view.moveTo(width/2,0);
  view.lineTo(width/2,height);
  view.moveTo(0, height/2);
  view.lineTo(width, height/2);
}

function render(view, canvas) {
  var s = Math.PI;
  console.log("Render");
  function mainLoop() {
    s -= 0.01;
    canvas.width = canvas.width;
    drawAxes(view);
    drawSinus(view, function(i) { return Math.sin((i + Math.sin(s) * 10) * Math.sin(s))});
    view.stroke();
    requestAnimFrame(mainLoop);
  }
  mainLoop();
}

$(function() {
  var canvas = $("#view")[0];
  var view = canvas.getContext("2d");
  var s = 1;
  render(view, canvas);
});
