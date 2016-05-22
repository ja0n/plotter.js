!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("Plotter",[],e):"object"==typeof exports?exports.Plotter=e():t.Plotter=e()}(this,function(){return function(t){function e(s){if(i[s])return i[s].exports;var o=i[s]={exports:{},id:s,loaded:!1};return t[s].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var i={};return e.m=t,e.c=i,e.p="",e(0)}([function(t,e,i){t.exports=i(1)},function(t,e){"use strict";function i(t,e){var i={};for(var s in t)e.indexOf(s)>=0||Object.prototype.hasOwnProperty.call(t,s)&&(i[s]=t[s]);return i}function s(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var o=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var s in i)Object.prototype.hasOwnProperty.call(i,s)&&(t[s]=i[s])}return t},n=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}}(),r=function(){function t(e,i){var o=this;s(this,t);var n="string"==typeof e?document.querySelector(e):e;if(this.ctx=n.getContext("2d"),!n||!this.ctx)throw new Error({Error:"Canvas element not found."});this.debug=!1,this.actors=[],this.bgColor="#F5F5F5",this.editing=!0,this.dragging=!1,this.mousedown={},this.offsetX=this.width/2,this.offsetY=this.height/2,this.vOffsetX=0,this.vOffsetY=0,this.vMaxOffsetX=20,this.vMaxOffsetY=20,this.scale=1,this.minScale=.4,this.maxScale=4,this.vScale={width:50,vWidth:1,height:50,vHeight:5},this.functions=[],this.origin={x:0,y:0},Object.assign(this,i),this.centralizeCoord(this.origin.x,this.origin.y),n.addEventListener("mousedown",function(t){t.preventDefault();var e=o.windowToCanvas(t.clientX,t.clientY),i={x:o.normalizeX(e.x),y:o.normalizeY(e.y)};o.consoleDebug("mousedown",e),o.consoleDebug("mousedown (normalized)",i),o.consoleDebug("normalize debug | offsetX: "+o.offsetX+" scale: "+o.scale),o.dragging=!0,o.prevLoc=e,o.dragCallback=function(t){var e=(t.x-this.prevLoc.x)/this.scale,i=(t.y-this.prevLoc.y)/this.scale;this.offsetX+=e,this.offsetY+=i,this.prevLoc=t},o.cursor("all-scroll")}),n.addEventListener("mousemove",function(t){t.preventDefault();var e=o.windowToCanvas(t.clientX,t.clientY);return o.dragging?(o.cursor("all-scroll"),o.dragCallback(e),o.runCycle(),void(o.onDrag&&o.onDrag())):void o.cursor("auto")}),n.addEventListener("mouseup",function(t){o.dragging=!1,o.cursor("auto")}),n.addEventListener("mousewheel",function(t){t.preventDefault();var e=o.centerCoord,i=e.x,s=e.y;t.deltaY>0&&o.scale-.1>o.minScale?o.scale-=.1:t.deltaY<0&&o.scale+.1<o.maxScale&&(o.scale+=.1),o.centralizeCoord(i,s),o.runCycle()}),addEventListener("mousedown",function(t){o.canvasFocus=t.target==n}),addEventListener("keydown",function(t){if(o.canvasFocus){switch(o.vOffsetX+=o.vOffsetX<o.vMaxOffsetX?1:0,o.vOffsetY+=o.vOffsetY<o.vMaxOffsetY?1:0,t.keyCode){case 37:o.offsetX+=o.vOffsetX;break;case 38:o.offsetY+=o.vOffsetY;break;case 39:o.offsetX-=o.vOffsetX;break;case 40:o.offsetY-=o.vOffsetY}o.runCycle(),o.onDrag&&o.onDrag()}}),addEventListener("keyup",function(t){o.canvasFocus&&(o.vOffsetX=o.vOffsetY=0)})}return n(t,[{key:"consoleDebug",value:function(){this.debug&&console.debug.apply(console,arguments)}},{key:"cursor",value:function(t){var e=this.ctx.canvas.style;return t?e.cursor=t:e.cursor}},{key:"setState",value:function(t){this.state=t}},{key:"isState",value:function(t){return this.state===t}},{key:"drawGrid",value:function(){var t=arguments.length<=0||void 0===arguments[0]?"lightgrey":arguments[0],e=arguments.length<=1||void 0===arguments[1]?25:arguments[1],i=arguments.length<=2||void 0===arguments[2]?25:arguments[2],s=this.ctx,o=this.vScale,n=o.vWidth,r=o.vHeight;s.save(),s.strokeStyle=t,s.lineWidth=.5;var a=this.width/this.scale,h=this.height/this.scale,f=this.offsetX%e,l=this.offsetY%i,c=-Math.floor((this.offsetX+e)/e),u=-Math.floor((this.offsetY+i)/i);s.font="10pt Arial",s.fillStyle="#000000";for(var v=f-e+.5;a+e>v;v+=e){s.beginPath(),s.moveTo(v-this.offsetX,0-this.offsetY),s.lineTo(v-this.offsetX,h-this.offsetY);var d=s.measureText(c).width,g=v-this.offsetX-d/2,y=this.origin.y+15;s.fillText(c++*n,g,y),s.stroke()}for(var x=l-i+.5;h+i>x;x+=i){s.beginPath(),s.moveTo(0-this.offsetX,x-this.offsetY),s.lineTo(a-this.offsetX,x-this.offsetY);var w=s.measureText(-c).width,p=this.origin.x-(w+15),k=x-this.offsetY-20;s.fillText((-u++*r).toFixed(1),p,k),s.stroke()}this.consoleDebug("start",-Math.floor(this.offsetX/e)),this.consoleDebug("plus ahead",Math.ceil(a/e)),s.restore()}},{key:"clearCanvas",value:function(){var t=this.ctx;t.save(),t.fillStyle=this.bgColor,t.fillRect(0,0,this.width,this.height),t.restore()}},{key:"startDragging",value:function(t){this.mousedown.x=t.x,this.mousedown.y=t.y}},{key:"windowToCanvas",value:function(t,e){var i=this.ctx.canvas,s=i.getBoundingClientRect();return{x:t-s.left*(i.width/s.width),y:e-s.top*(i.height/s.height)}}},{key:"drawHorizontalLine",value:function(t){var e=this.ctx;e.beginPath(),e.moveTo(0-this.offsetX,t+.5),e.lineTo(0-this.offsetX+this.width/this.scale,t+.5),e.stroke()}},{key:"drawVerticalLine",value:function(t){var e=this.ctx;e.beginPath(),e.moveTo(t+.5,0-this.offsetY),e.lineTo(t+.5,0-this.offsetY+this.height/this.scale),e.stroke()}},{key:"drawAxes",value:function(){var t=(arguments.length<=0||void 0===arguments[0]?"x":arguments[0],arguments.length<=1||void 0===arguments[1]?"y":arguments[1],arguments[2],this.x_padding+.5,this.y_padding+.5,this.ctx),e=this.origin,i=e.x,s=e.y;t.strokeStyle="#000000",t.lineWidth=.5,t.beginPath(),t.moveTo(-this.offsetX,s/this.scale),t.lineTo(-this.offsetX+this.width/this.scale,s/this.scale),t.moveTo(i/this.scale,-this.offsetY),t.lineTo(i/this.scale,-this.offsetY+this.height/this.scale),t.stroke()}},{key:"generatePoints",value:function(t){var e=arguments.length<=1||void 0===arguments[1]?100:arguments[1],i=this.vScale,s=this.width/this.scale,o=s/i.width/e,n=function(){},r=new Array;try{n=new Function("x","with (Math) return "+t),n(0)}catch(a){return console.error("bad expression input"),[]}for(var h=-(Math.floor(this.offsetX/i.width)+1),f=Math.ceil((s-this.offsetX)/i.width)+1,l=h;f>=l;l+=o)r.push({x:l,y:n(l)});return r}},{key:"centralizeCoord",value:function(t,e){this.offsetX=t+this.width/2/this.scale,this.offsetY=e+this.height/2/this.scale,this.runCycle()}},{key:"addFunction",value:function(t){var e=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];e.func=t;var i=this.functions.push(o({},e,{func:t}));return this.runCycle(),this.functions[i-1]}},{key:"drawFunctions",value:function(t){var e=this;this.functions.forEach(function(t){var s=t.func,o=i(t,["func"]);return e.drawPoints(e.generatePoints(s,o.amountPoints),o)})}},{key:"drawPoints",value:function(t,e){var i=this,s={color:"#0000ff",point:!0,line:!0,pointSize:1,lineWidth:1,pointColor:"black",lineColor:"black",fill:!0};Object.assign(s,e);var o=this.ctx,n=(this.origin,this.vScale),r=n.vWidth,a=n.vHeight,h=this.vScale.width/r,f=this.vScale.height/a;o.save();var l=function(t,e,n){o.beginPath(),o.arc(t*h,-e*f,n/i.scale,0,2*Math.PI,!0),s.fill?o.fill():o.stroke()};s.line&&(o.beginPath(),o.strokeStyle=s.lineColor,t.forEach(function(t){var e=t.x,i=t.y;return o.lineTo(e*h,-i*f)}),o.lineWidth=s.lineWidth,o.stroke()),s.point&&(o.strokeStyle=o.fillStyle=s.pointColor,t.forEach(function(t){var e=t.x,i=t.y;return l(e,i,s.pointSize)})),o.restore()}},{key:"runCycle",value:function(){var t=this.ctx,e=this.vScale;this.clearCanvas(),t.save(),t.scale(this.scale,this.scale),t.translate(this.offsetX,this.offsetY),this.drawGrid("lightgray",e.width,e.height),this.drawAxes(),this.drawFunctions(100),t.restore()}},{key:"normalizeX",value:function(t){return(t-this.offsetX)/this.scale}},{key:"normalizeY",value:function(t){return(t-this.offsetY)/this.scale}},{key:"round",value:function(t){return+(Math.round(2*t)/2).toFixed(1)}},{key:"width",get:function(){return this.ctx.canvas.width}},{key:"height",get:function(){return this.ctx.canvas.height}},{key:"centerCoord",get:function(){return{x:this.offsetX-this.width/2/this.scale,y:this.offsetY-this.height/2/this.scale}}}]),t}();e["default"]=r,t.exports=e["default"]}])});
//# sourceMappingURL=plotter.js.map