export default class Plotter {
  constructor(el, opts) {
    let canvas = typeof el === 'string' ? document.querySelector(el) : el;
    this.ctx = canvas.getContext('2d');
    
    if (!canvas || !this.ctx)
      throw new Error({'Error': 'Canvas element not found.'});
    
    this.debug = false;
    this.actors = [];
    this.editing = true;
    this.dragging = false;
    this.mousedown = {};
    this.offsetX = this.width/2;
    this.offsetY = this.height/2;
    this.vOffsetX = 0;
    this.vOffsetY = 0;
    this.vMaxOffsetX = 20;
    this.vMaxOffsetY = 20;
    this.scale = 1;
    this.minScale = 0.4;
    this.maxScale = 4;
    this.vScale = {
      width: 50,
      vWidth: 1,
      height: 50,
      vHeight: 5  ,
    };

    this.functions = [];

    this.origin = {
      x: 0,
      y: 0,
    };

    Object.assign(this, opts);

    this.centralizeCoord(this.origin.x, this.origin.y);

    canvas.addEventListener('mousedown', e => {
      e.preventDefault();
      const loc = this.windowToCanvas(e.clientX, e.clientY);
      const locNormalized = { x: this.normalizeX(loc.x), y: this.normalizeY(loc.y) };

      this.consoleDebug('mousedown', loc);
      this.consoleDebug('mousedown (normalized)', locNormalized);
      this.consoleDebug(`normalize debug | offsetX: ${this.offsetX} scale: ${this.scale}`);

      this.dragging = true;
      this.prevLoc = loc;
      this.dragCallback = function(loc) {
        let dtX = (loc.x - this.prevLoc.x)/this.scale;
        let dtY = (loc.y - this.prevLoc.y)/this.scale;
        this.offsetX += dtX;
        this.offsetY += dtY;
        this.prevLoc = loc;
      };

      this.cursor('all-scroll');
    });

    canvas.addEventListener('mousemove', e => {
      e.preventDefault(); // prevent selections
      let loc = this.windowToCanvas(e.clientX, e.clientY);
      if (this.dragging) {
        this.cursor('all-scroll');
        this.dragCallback(loc);
        this.runCycle();
        if (this.onDrag) this.onDrag();
        return;
      }
      this.cursor('auto');

    });

    canvas.addEventListener('mouseup', e => {
      this.dragging = false;
      this.cursor('auto');
    });

    canvas.addEventListener('mousewheel', e => {
      e.preventDefault();

      const { x, y } = this.centerCoord;

      if (e.deltaY > 0 && (this.scale - 0.1) > this.minScale) {
        this.scale -= 0.1;
      } else if (e.deltaY < 0 && (this.scale + 0.1) < this.maxScale) {
        this.scale += 0.1;
      }

      this.centralizeCoord(x, y);

      this.runCycle();
    });

    addEventListener('mousedown', e =>{
      this.canvasFocus = e.target == canvas;
    });

    addEventListener('keydown', e => {
      if (!this.canvasFocus) return;

      this.vOffsetX += this.vOffsetX < this.vMaxOffsetX ? 1 : 0;
      this.vOffsetY += this.vOffsetY < this.vMaxOffsetY ? 1 : 0;

      switch (e.keyCode) {
        case 37:
          this.offsetX += this.vOffsetX;
          break;
        case 38:
          this.offsetY += this.vOffsetY;
          break;
        case 39:
          this.offsetX -= this.vOffsetX;
          break;
        case 40:
          this.offsetY -= this.vOffsetY;
          break;
      }

      this.runCycle();
      if (this.onDrag) this.onDrag();
    });

    addEventListener('keyup', e => {
      if (!this.canvasFocus) return;
      this.vOffsetX = this.vOffsetY = 0;
    });
  }

  get width() {
    return this.ctx.canvas.width;
  }

  get height() {
    return this.ctx.canvas.height;
  }

  get centerCoord() {
    return {
      x: this.offsetX - this.width/2/this.scale,
      y: this.offsetY - this.height/2/this.scale,
    };
  }

  consoleDebug() {
    if (this.debug)
      console.debug.apply(console, arguments);
  }

  cursor(cursor) {
    let css = this.ctx.canvas.style;
    return cursor ? css.cursor = cursor : css.cursor;
  }

  setState(state) {
    this.state = state;
  }

  isState(state) {
    return this.state === state;
  }

  drawGrid(color = 'lightgrey', stepX = 25, stepY = 25) {
    const { ctx, vScale: { vWidth, vHeight } } = this;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;

    const width = this.width/this.scale;
    const height = this.height/this.scale;
    
    const startX = this.offsetX % stepX;
    const startY = this.offsetY % stepY;

    let text = -Math.floor((this.offsetX + stepX)/stepX);
    let textY = -Math.floor((this.offsetY + stepY)/stepY);
    
    ctx.font = "10pt Arial";
    ctx.fillStyle = '#000000';
    
    for (let i = startX - stepX + 0.5; i < width + stepX; i += stepX) {
      ctx.beginPath();
      ctx.moveTo(i - this.offsetX, 0 - this.offsetY);
      ctx.lineTo(i - this.offsetX, height - this.offsetY);

      const tWidth = ctx.measureText(text).width;
      const x = i - this.offsetX - (tWidth/2), y = this.origin.y + 15;
      ctx.fillText(text++ * vWidth, x, y);

      ctx.stroke();
    }

    for (let i = startY - stepY + 0.5; i < height + stepY; i += stepY) {
      ctx.beginPath();
      ctx.moveTo(0 - this.offsetX, i - this.offsetY);
      ctx.lineTo(width - this.offsetX, i - this.offsetY);

      const tWidth = ctx.measureText(-text).width;
      const x = this.origin.x - (tWidth + 15), y = i - this.offsetY - 20;
      ctx.fillText((-textY++ * vHeight).toFixed(1), x, y);
      
      ctx.stroke();
    }

    this.consoleDebug('start', -Math.floor(this.offsetX/stepX));
    this.consoleDebug('plus ahead', Math.ceil(width/stepX));

    ctx.restore();
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  startDragging(loc) {
    this.mousedown.x = loc.x;
    this.mousedown.y = loc.y;
  }
  windowToCanvas(x, y) {
    const canvas = this.ctx.canvas;
    const bbox = canvas.getBoundingClientRect();

    return { 
      x: x - bbox.left * (canvas.width  / bbox.width),
      y: y - bbox.top  * (canvas.height / bbox.height),
    };
  }
  drawHorizontalLine (y) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(0 - this.offsetX, y+0.5);
    ctx.lineTo(0 - this.offsetX + this.width/this.scale, y+0.5);
    ctx.stroke();
  }
  drawVerticalLine (x) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(x+0.5, 0 - this.offsetY);
    ctx.lineTo(x+0.5, 0 - this.offsetY + this.height/this.scale);
    ctx.stroke();
  }
  
  drawAxes(xlabel = 'x', ylabel = 'y', opts) {
    var x_pad = this.x_padding + 0.5, y_pad = this.y_padding + 0.5;

    const { ctx, origin: { x, y } } = this;

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0.5;

    ctx.beginPath();


    ctx.moveTo(-this.offsetX, y/this.scale);
    ctx.lineTo(-this.offsetX + this.width/this.scale, y/this.scale);
    ctx.moveTo(x/this.scale, -this.offsetY);
    ctx.lineTo(x/this.scale, -this.offsetY + this.height/this.scale);
    ctx.stroke();

    // ctx.font = "12pt Arial";
    // ctx.fillStyle = '#000000';
    // ctx.textAlign = "left";
    // ctx.textBaseline = "top";
    // ctx.fillText(xlabel, this.width + this.x_padding + 15/2, this.y_max + this.y_padding - 10);
    // ctx.fillText(ylabel, this.x_min + 15 + 15/2, this.y_padding - 20 );

  }

  generatePoints(fx, n = 100) {
    const { vScale } = this;
    const scaledWidth = this.width/this.scale;
    const k = scaledWidth/vScale.width/n;
    let f = () => {};

    const Points = new Array();

    try {
      f = new Function('x', `with (Math) return ${fx}`);
      f(0);
    } catch(e) {
      console.error('bad expression input');
      return [];
    }

    const startX = -(Math.floor(this.offsetX/vScale.width) + 1);
    const endX = Math.ceil((scaledWidth - this.offsetX)/vScale.width) + 1;

    for (let i = startX; i <= endX; i += k) {
      Points.push({ x: i, y: f(i) });
    }

    return Points;
  }

  centralizeCoord(x, y) {
    this.offsetX = x + this.width/2/this.scale;
    this.offsetY = y + this.height/2/this.scale;
    this.runCycle();
  }

  addFunction(func, opt = {}) {
    opt.func = func;

    const index = this.functions.push({ ...opt, func });

    this.runCycle();

    return this.functions[index - 1];
  }

  drawFunctions(n) {
    this.functions.forEach(({ func, ...opt }) => this.drawPoints(this.generatePoints(func, opt.amountPoints), opt));
  }

  drawPoints(data, custom) {
    let opts = {
      color: '#0000ff',
      point: true,
      line: true,
      pointSize: 1,
      lineWidth: 1,
      pointColor: 'black',
      lineColor: 'black',
      fill: true,
    };

    Object.assign(opts, custom);
    
    const { ctx, origin, vScale: { vWidth, vHeight } } = this;
    const xScale = this.vScale.width/vWidth;
    const yScale = this.vScale.height/vHeight;

    ctx.save();

    const drawPoint = (x, y, radius) => {
      ctx.beginPath();
      ctx.arc(x * xScale, -y * yScale, radius/this.scale, 0, 2 * Math.PI, true);
      opts.fill ? ctx.fill() : ctx.stroke();
    };

    if (opts.line) {
      ctx.beginPath();
      ctx.strokeStyle = opts.lineColor;
      data.forEach(({ x, y }) => ctx.lineTo(x * xScale,  -y * yScale));
      ctx.lineWidth = opts.lineWidth;
      ctx.stroke();
    }

    if (opts.point) {
      ctx.strokeStyle = ctx.fillStyle = opts.pointColor;
      data.forEach(({ x, y }) => drawPoint(x, y, opts.pointSize));
    }

    ctx.restore();
  }

  runCycle() {
    const { ctx, vScale } = this;
    this.clearCanvas();
    ctx.save();
    ctx.scale(this.scale, this.scale);
    ctx.translate(this.offsetX, this.offsetY);
    this.drawGrid('lightgray', vScale.width, vScale.height);
    this.drawAxes();

    this.drawFunctions(100);

    ctx.restore();
  }

  normalizeX(x) {
    return (x - this.offsetX)/this.scale;
  }

  normalizeY(y) {
    return (y - this.offsetY)/this.scale;
  }

  round(number) {
    return +(Math.round(number * 2) / 2).toFixed(1)
  }
}
