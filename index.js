import Plotter from './Plotter';

var plotter = new Plotter('#canvas', { generatrix: 'x*x' });
plotter.addFunction('x*x', {
  line: true,
  point: true,
  pointSize: 2,
  pointColor: 'red',
});
plotter.addFunction('x*x + 10');

plotter.runCycle();
