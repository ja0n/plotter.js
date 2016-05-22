# plotter.js
A library for plotting math functions on `<canvas>` (HTML element).

**[Live Demo](http://ja0n.github.io/plotter.js/)**

# Usage
It's easy as pie. Firstly you need the files:
 * [minified](http://ja0n.github.io/plotter.js/plotter.js)
 * [source-map](http://ja0n.github.io/plotter.js/plotter.js.map)

Then

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="plotter.js"></script>
    <script>
      window.onload = function() {
        var plotter = new Plotter('graph');
        plotter.addFunction('x', { lineColor: 'red' });
        plotter.addFunction('x * x', { lineColor: 'blue' });
      };
    </script>
  </head>
  <body>
    <canvas id="graph" width="500" height="380"></canvas>
  </body>
</html>
```

For more details see examples folder.

# Development
Clone this repo
```sh
git clone https://github.com/ja0n/plotter.js.git
```
Install dev dependencies
```sh
npm install
```
Run dev server
```sh
npm run serve
```
And open http://localhost:8090/

Or build files
```sh
npm run build
```
