window.onload = function() {
  var queryParams = getQueryParams();
  var plotter = new Plotter('#canvas');
  var share = document.getElementById('share');

  setShareUrl(queryParams.func || 'x*x');
  var func = plotter.addFunction(queryParams.func || 'x*x', {
    line: true,
    point: true,
    lineWidth: 1,
    pointSize: 2,
    lineColor: '#000000',
    pointColor: '#ff0000',
    amountPoints: 150,
  });

  var runCycle = plotter.runCycle.bind(plotter);

  resizeCanvas();
  plotter.centralizeCoord(0, 0);

  var gui = new dat.GUI();

  gui.add(func, 'line').onChange(runCycle);
  gui.add(func, 'point').onChange(runCycle);
  gui.add(func, 'lineWidth', 1, 6).onChange(runCycle);
  gui.add(func, 'pointSize', 1, 6).onChange(runCycle);
  gui.add(func, 'amountPoints', 5, 500).onChange(runCycle);
  gui.addColor(func, 'lineColor').onChange(runCycle);
  gui.addColor(func, 'pointColor').onChange(runCycle);
  gui.add(func, 'func').onFinishChange(function() {
    setShareUrl(func.func);
    runCycle();
  });

  window.addEventListener('resize', resizeCanvas);

  function resizeCanvas() {
    var height = document.body.clientHeight;
    var width = document.body.clientWidth;
    var canvas = document.getElementById('canvas');
    canvas.width = width; canvas.height = height;
    runCycle();
  }

  function setShareUrl(func) {
    share.href = "http://ja0n.github.io/plotter.js/?func=" + func;
  }

};

// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getQueryParams() {
  var match,
      pl     = /\%20/g,
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      query  = window.location.search.substring(1);

  var urlParams = {};
  while (match = search.exec(query))
    urlParams[decode(match[1])] = decode(match[2]);

  return urlParams;
}
