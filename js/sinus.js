var translations = {
  move: {
    x: 0,
    y: 0
  },
  scale: {
    x: 1,
    y: 1
  }
}

var marks = []
var zoom = 50;
var golden_ratio_conjugate = 0.618033988749895
var hue_c = 0.42;

var canvas;
var view;

function nextHue() {
  hue_c += golden_ratio_conjugate;
  hue_c %= 1;
  return hue_c * 365;
}

function drawSinus(view, f) {
  var width = view.canvas.width;
  var height = view.canvas.height;
  view.moveTo(0, height/2);
  for(var i = -width/2; i * zoom < width/2; i+=0.2) {
    view.lineTo(width/2 + i * zoom, height/2 - f(i) * zoom);
  }
}

function drawMarks(view, marks) {
  $.each(marks, function(i,e) {
    var width = view.canvas.width;
    var height = view.canvas.height;
    var x = width/2 + (e.x + translations.move.x) * zoom * translations.scale.x;
    var y = height/2 + (e.y * translations.scale.y - translations.move.y) * zoom;
    view.beginPath();
    view.moveTo(x,y);
    view.arc(x, y, 5, 0, 2 * Math.PI);
    view.fillStyle = "hsl(" + e.hue + ",50%,50%)";
    view.fill();
  });
}

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

function sinCurrent(x) {
  return translations.scale.y * Math.sin(x / translations.scale.x - translations.move.x) + translations.move.y;
}

function drawAxes(view) {
  var height = view.canvas.height;
  var width = view.canvas.width;
  view.moveTo(width/2,0);
  view.lineTo(width/2,height);
  view.moveTo(0, height/2);
  view.lineTo(width, height/2);
}

function render(view, canvas) {
  // Clear screen
  canvas.width = canvas.width;
  
  // Make path
  drawAxes(view);
  drawSinus(view, sinCurrent);
  
  // Draw path
  view.strokeStyle = "#111111";
  view.stroke();

  // Draw marks
  view.beginPath();
  drawMarks(view, marks);
}

$(function() {
  canvas = $("#view")[0];
  canvas.width = $(document).width() - 10;
  canvas.height = $(document).height() - 10;
  view = canvas.getContext("2d");
  render(view, canvas);

  var arrow_left = 37;
  var arrow_right = 39;
  var arrow_up = 38;
  var arrow_down = 40;
  var key_enter = 13;
  var key_space = 32;

  $("html").click(function() {
    $("#help-content").hide();
  });
  
  $("#help-content").hide();
  $("#help-button").click(function(e) {
    $("#help-content").toggle();
    e.stopPropagation();
  });

  $("html").keydown(function(e) {
    switch(e.which) {
      case arrow_left:
        if(e.ctrlKey) translations.scale.x /= 1.01;
        else translations.move.x -= 0.1 / translations.scale.x;
        break;
      case arrow_right:
        if(e.ctrlKey) translations.scale.x *= 1.01;
        else translations.move.x += 0.1 / translations.scale.x;
        break;
      case arrow_up:
        if(e.ctrlKey) translations.scale.y *= 1.02;
        else translations.move.y += 0.15 / translations.scale.y;
        break;
      case arrow_down:
        if(e.ctrlKey) translations.scale.y /= 1.02;
        else translations.move.y -= 0.15 / translations.scale.y;
        break;
      case key_enter:
        if(!e.altKey) {
          translations.move.x = 0;
          translations.move.y = 0;
          translations.scale.x = 1;
          translations.scale.y = 1;
        }
        if(!e.ctrlKey) {
          hue_c = 0.42;
          marks = [];
        }
        break;
      case key_space:
        marks.push({
          x: -translations.move.x, 
          y: -Math.sin(-translations.move.x),
          hue: nextHue()
        });
        break;
    }
    render(view, canvas);
  });

});
