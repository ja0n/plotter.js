var Graph = function (ctx, xmin, xmax, ymin, ymax, width, height) {
	this.ctx = ctx;
	this.ctx.canvas.width = width + 250;
	this.ctx.canvas.height = height + 250;
	this.width = width + 1;
	this.height = height + 1;
	this.interval = xmax - xmin;

	this.x_scale = (xmax-xmin)/width;
	this.y_scale = (ymax-ymin)/height;

	this.x_padding = 25;
	this.y_padding = 25;

	this.x_axe = -xmin/this.x_scale;
	this.y_axe = ymax/this.y_scale;

	var x_min_rel = xmin/this.x_scale;
	var x_max_rel = xmax/this.x_scale;
	var y_min_rel = ymin/this.y_scale;
	var y_max_rel = ymax/this.y_scale;

	this.x_min = Math.abs(x_min_rel);
	this.x_max = Math.abs(x_max_rel);
	this.y_min = Math.abs(y_min_rel);
	this.y_max = Math.abs(y_max_rel);

	this.tw=15;
	this.th=20;
};

Graph.prototype = {
	drawGrid: function (xmajor, xminor, ymajor, yminor) {
		this.ctx.lineWidth = 0.5;
		var stepx_major = xmajor/this.x_scale;
		var stepx_minor = xminor/this.x_scale;
		var stepy_major = ymajor/this.y_scale;
		var stepy_minor = yminor/this.y_scale;

		var x_pad = this.x_padding, y_pad = this.y_padding;
		var w_max = this.width + x_pad, h_max = this.height + y_pad;
		var i;

		this.ctx.beginPath();

		for (i = 0.5 + x_pad; i < w_max; i += stepx_major) {
			this.ctx.moveTo(i, y_pad);
			this.ctx.lineTo(i, h_max);
		}

		for (i = 0.5 + y_pad; i < h_max; i += stepy_major) {
			this.ctx.moveTo(x_pad, i);
			this.ctx.lineTo(w_max, i);
		}

		this.ctx.strokeStyle = "#999999";
		this.ctx.stroke();

		this.ctx.beginPath();

		for (i = 0.5 + x_pad; i < w_max; i += stepx_minor) {
			this.ctx.moveTo(i, y_pad);
			this.ctx.lineTo(i, h_max);
		}

		for (i = 0.5 + y_pad; i < h_max; i += stepy_minor) {
			this.ctx.moveTo(x_pad, i);
			this.ctx.lineTo(w_max, i);
		}

		this.ctx.strokeStyle = "#cccccc";
		this.ctx.stroke();

		this.ctx.font = "10pt Arial";
		this.ctx.fillStyle = '#000000';

		var text;
		for (i = 0; i <= this.x_min + this.x_max; i += stepx_major) {
			text = Math.round((i - this.x_min) * this.x_scale);
			var width = this.ctx.measureText(text).width;
			var x = i + x_pad - (width/2), y = this.y_max + y_pad + 15;
			this.ctx.fillText(text, x, y);
		}


		for (i = this.y_min + this.y_max; i >= 0; i -= stepy_major) {
			text = -Math.round((i - this.y_max) * this.y_scale);
			var width = this.ctx.measureText(text).width;
			var x = this.x_min, y = i + y_pad + 15/2;
			this.ctx.fillText(text, x, y);
		}

		return this;
	},
	drawAxes: function (xlabel, ylabel, opts) {
		if(!xlabel) xlabel = 'x';
		if(!ylabel) ylabel = 'y';

		var x_pad = this.x_padding + 0.5, y_pad = this.y_padding + 0.5;

		this.ctx.strokeStyle = '#000000';
		this.ctx.lineWidth = 0.5;

		this.ctx.beginPath();

		this.ctx.moveTo(x_pad, this.y_axe + y_pad);
		this.ctx.lineTo(this.x_min + this.x_max + x_pad, this.y_axe + y_pad);
		this.ctx.moveTo(this.x_axe + x_pad, y_pad);
		this.ctx.lineTo(this.x_axe + x_pad, this.y_min + this.y_max + y_pad);
		this.ctx.stroke();

		this.ctx.font = "12pt Arial";
		this.ctx.fillStyle = '#000000';
		this.ctx.textAlign = "left";
		this.ctx.textBaseline = "top";
		this.ctx.fillText(xlabel, this.width + this.x_padding + 15/2, this.y_max + this.y_padding - 10);
		this.ctx.fillText(ylabel, this.x_min + 15 + 15/2, this.y_padding - 20 );

	},
	generatePoints: function (fx, n) {
		var k = this.interval/n, q = Math.ceil(n/2);
		var xA = new Array(), yA = new Array();

		var f = new Function('x', 'return ' + fx);

		for(var i = -q; i <= q; i++) {
			xA.push(i * k);
			yA.push(f(i * k));
		}

		return { x: xA, y: yA };
	},
	plot: function (opts) {
		if(!opts.color) opts.color = '#0000ff';
		if(!opts.color) opts.dots = true;
		if(!opts.color) opts.line = true;
		// var xpos= this.x_orig + xArr[0] / this.x_scale;
		// var ypos= this.y_orig - yArr[0] / this.y_scale;

		//clip region
		var x_pad = this.x_padding, y_pad = this.y_padding;
		this.ctx.save();
		this.ctx.rect(x_pad, y_pad, this.width, this.height);
		this.ctx.clip();
		this.ctx.beginPath();
		// this.ctx.arc(xpos,ypos,1,0,2*Math.PI,true);
		var Points = opts.points;
		// var x_orig = this.x_orig + x_pad;
		// var y_orig = this.y_orig + y_pad;
		var x_orig = this.x_min + x_pad;
		var y_orig = this.y_max + y_pad;

		for (var i=0; i<Points.x.length; i++){
			xpos = x_orig + Points.x[i]/this.x_scale;
			ypos = y_orig - Points.y[i]/this.y_scale;
			if (opts.line){
				this.ctx.lineTo(xpos,ypos);
			}else{
				this.ctx.moveTo(xpos,ypos);
			}
			if (opts.dots){
				this.ctx.arc(xpos,ypos,1,0,2*Math.PI,true);
			}
		}

		this.ctx.strokeStyle = opts.color;
		this.ctx.stroke();
		this.restore();
	}
};
