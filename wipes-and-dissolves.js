/*
	Canvas Wipes & Dissolves
	Carlos R. Tirado - 2011
*/

// setup namespace W_D (for Wipes and Dissolves)
var W_D = {
	canvas: null,
	context: null,
	img1: null,
	img2: null,
	timer: null,
	busy: false,
	fx_list: [],
}
// W_D must be setup before effects can be called.
// need two images (transition one to the other), and a <canvas> element
W_D.setup = function( params ) {
	this.canvas = params.canvas;
	this.img1 = params.img1;
	this.img2 = params.img2;
	this.context = this.canvas.getContext('2d');
	this.context.drawImage( this.img1, 0, 0 ); // show first image
	for( var i in this.fx ) { this.fx_list.push( i ); }
}
W_D.reset = function() {
	if( this.timer ) { clearInterval( this.timer ); }
	this.busy = true;
	// temp. flip img1 & img2
	var tmp = this.img1.src;
	this.img1.src = this.img2.src;
	this.img2.src = tmp;
}
W_D.finish_fx = function() {
	this.context.drawImage( this.img1, 0, 0 );
	this.busy = false;
	clearInterval( this.timer );
}

W_D.slideshow = function(reps) {
	(function(reps) {
		r = Math.floor( Math.random() * W_D.fx_list.length );
		W_D.fx[ W_D.fx_list[r]]();
		var itv = setInterval( function() {
			if( !W_D.busy ) {
				reps -= 1;
				if( 0 < reps ) {
					// pause one second before next slide
					ti = new Date(); while ((new Date()) - ti <= 1000) { /* idle */ }
					r = Math.floor( Math.random() * W_D.fx_list.length );
					W_D.fx[ W_D.fx_list[r]]();
				} else { clearInterval( itv ); }
			}
		}, 1000);
	}(reps));
}
/* Effects: */
W_D.fx = {
	iris : function() {
		var _this = W_D;
		var loop = 0;
		_this.reset();
		_this.timer = setInterval( function() {
			if( loop < 200 ) {
				x =  _this.img1.width  / 2 - loop * _this.img1.width / 400;
				y =  _this.img1.height / 2 - loop * _this.img1.height / 400;
				w = (_this.img1.width  / 2 - x ) * 2;
				h = (_this.img1.height / 2 - y ) * 2;
				_this.context.drawImage( _this.img1, x, y, w, h, x, y, w, h );
				loop += 1;
			} else {
				_this.finish_fx();
			}
		}, 1 );
	},

	random : function() {
		var _this = W_D;
		_this.reset();
		var grid_size = 20; // default 20 x 20 grid
		if( 0 < arguments.length && 0 < arguments[0] ) {
			grid_size = arguments[0];
		}
		var grid = new Array();
		for( var i = 0; i < (grid_size * grid_size); i++ ) { grid[ i ] = i; }
		var loop = (grid_size * grid_size) - 1;
		_this.timer = setInterval( function() {
			if( 0 <= loop ) {
				r = Math.floor( Math.random() * loop );
				loop2 = grid[ r ];
				grid[ r ] = grid[ loop ];
				x = ( loop2 % grid_size ) * Math.floor( _this.img1.width / grid_size );
				y = Math.floor( loop2 / grid_size ) * Math.floor( _this.img1.height / grid_size );
				w = Math.floor( _this.img1.width / grid_size );
				h = Math.floor( _this.img1.height / grid_size );
				_this.context.drawImage( _this.img1, x, y, w, h, x, y, w, h );
				loop -= 1;
			} else {
				_this.finish_fx();
			}
		});
	},

	cross : function() {
		var _this = W_D;
		_this.reset();
		var loop = 0;
		var w = _this.img1.width  / 40;
		var h = _this.img1.height / 40;
		_this.timer = setInterval( function() {
			if( loop < 20 ) {
				/* individually each Quadrant could be a from-corner transition */
				x = loop * w;
				y = loop * h;
				// NW Quadrant
				_this.context.drawImage( _this.img1, 0, y, w * (loop + 1), h, 0, y, w * (loop + 1), h );
				_this.context.drawImage( _this.img1, x, 0, w, h * (loop + 1), x, 0, w, h * (loop + 1));
				// SW Quadrant
				y = _this.img1.height - h * (loop + 1);
				_this.context.drawImage( _this.img1, w * loop, y, w, h * (loop + 1), w * loop, y, w, h * (loop + 1));
				_this.context.drawImage( _this.img1, 0, y, w * (loop + 1), h, 0, y, w * (loop + 1), h );
				// SE Quadrant /* vary width and y, x img.width - width */
				x = _this.img1.width - w * (loop + 1);
				_this.context.drawImage( _this.img1, x, y, w, h * (loop + 1), x, y, w, h * (loop + 1));
				_this.context.drawImage( _this.img1, x, y, w * (loop + 1), h, x, y, w * (loop + 1), h );
				// NE Quadrant
				y = 0;
				_this.context.drawImage( _this.img1, x, y, w, h * (loop + 1), x, y, w, h * (loop + 1));
				_this.context.drawImage( _this.img1, x, h * loop, w * (loop + 1), h, x, h * loop, w * (loop + 1), h);
				loop += 1;
			} else {
				_this.finish_fx();
			}
		}, 33);
	},

	assemble : function() {
		var _this = W_D;
		_this.reset();
		var loop = 0;
		var w = _this.img1.width / 40;
		var h = _this.img1.height / 8;
		_this.timer = setInterval( function() {
			if( loop < 40 ) {
				for( loop2=0; loop2<8; loop2++ ) {
					y = loop2 * h;
					if( 0 == loop2 % 2 ) {
						x = loop * _this.img1.width / 40;
					} else {
						x = _this.img1.width - loop * _this.img1.width / 40 - _this.img1.width / 40;
					}
					_this.context.drawImage( _this.img1, x, y, w, h, x, y, w, h );
				}
				loop += 1;
			} else {
				_this.finish_fx();
			}
		}, 10);
	},

	checkerboard : function() {
		var _this = W_D;
		_this.reset();
		var loop = 0;
		var w = Math.floor( _this.img1.width / 10 );
		var h = Math.floor( _this.img1.height / 10 );
		_this.timer = setInterval( function() {
			if( loop < 100 ) {
				loop2 = loop * 2 - (49 < loop ? 99 : 0);
				x = (loop2 % 10) * w + (1 == (Math.floor(loop2 / 10) % 2) ? w : 0)
					- (1 == (Math.floor(loop2 / 10) % 2) && 49 < loop ? 2 * w : 0);
				y = Math.floor(loop2 / 10) * h;
				_this.context.drawImage( _this.img1, x, y, w, h, x, y, w, h );
				loop += 1;
			} else {
				_this.finish_fx();
			}
		}, 10);
	},

	rollup : function() {
		var _this = W_D;
		_this.reset();
		var loop = 1;
		var roll_h = Math.floor(_this.img1.height / 5); // << 20% height 
		var scr_copy = new Image; scr_copy.src = _this.img2.src;
		var w = _this.img1.width;
		var h = _this.img1.height;
		_this.timer = setInterval( function() {
			if( loop < h - 1 ) {
				if( loop < roll_h ) {
					// start roll up, pull bottom edge to roll_h
					_this.context.drawImage( _this.canvas, 0, h - (loop + loop - 1), w, loop, 0, _this.img1.height - (loop + loop + 1), w, loop);
					_this.context.drawImage( scr_copy, 0, h - (loop + 1), w, 1, 0, h - (loop + 1), w, 1);
					_this.context.drawImage( _this.img1, 0, h - loop, w, 1, 0, h - loop, w, 1);
				} else if( loop > (h - roll_h)) {
					// hit top of screen, gradually remove remaining roll
					_this.context.drawImage( _this.canvas, 0, 2, w, (h - loop - 1), 0, 0, w, (h - loop - 1));
					_this.context.drawImage( scr_copy, 0, h - loop - 1, w, 1, 0, h - loop - 1, w, 1);
					_this.context.drawImage( _this.img1, 0, h - loop, w, 1, 0, h - loop, w, 1);
				} else {
					// lifted portion can roll unto itself
					_this.context.drawImage( _this.canvas, 0, h - loop - roll_h + 2, w, roll_h - 1, 0, h - loop - roll_h, w, roll_h - 1);
					_this.context.drawImage( scr_copy, 0, h - loop - 1, w, 1, 0, h - loop - 1, w, 1);
					_this.context.drawImage( _this.img1, 0, h - loop, w, 1, 0, h - loop, w, 1);
				}
				loop += 1;
			} else {
				_this.finish_fx();
			}
		}, 10);
	},

	rolldown : function() {
		var _this = W_D;
		_this.reset();
		var loop = 1;
		var roll_h = Math.floor(_this.img1.height / 5); // << 20% height 
		_this.timer = setInterval( function() {
			w = _this.img1.width; h = _this.img1.height;
			if( loop < h - 1) {
				if( loop < roll_h ) {
					// start roll down
					_this.context.drawImage( _this.canvas, 0, 0, w, loop, 0, 2, w, loop);
					_this.context.drawImage( _this.img1, 0, loop * 2 + 1, w, 1, 0, 1, w, 1);
					_this.context.drawImage( _this.img1, 0, loop * 2 + 2, w, 1, 0, 0, w, 1);
				} else if( loop >= roll_h && loop < (h - roll_h - 1)) {
					// unroll
					_this.context.drawImage( _this.canvas, 0, loop - roll_h, w, roll_h - 1, 0, loop - roll_h + 2, w, roll_h - 1);
					_this.context.drawImage( _this.img1, 0, loop + roll_h + 1, w, 1, 0, loop - roll_h + 1, w, 1);
					_this.context.drawImage( _this.img1, 0, loop - roll_h, w, 1, 0, loop - roll_h, w, 1);
				} else {
					// getting to bottom of screen, unroll tail of image
					y = h - loop;
					_this.context.drawImage( _this.canvas, 0, loop - y + 1, w, y - 1, 0, loop - y + 3, w, y - 1);
					_this.context.drawImage( _this.img1, 0, loop - y, w, 2, 0, loop - y, w, 2);
				}
				loop += 1;
			} else {
				_this.finish_fx();
			}
		}, 1);
	},

	cover : function() {
		var _this = W_D;
		_this.reset();
		var loop = 0;
		_this.timer = setInterval( function() {
			if( loop < _this.img1.height ) {
				_this.context.drawImage( _this.img1, 0, _this.img1.height-loop, _this.img1.width, loop,
					0, 0, _this.img1.width, loop );
				loop += 1;
			} else {
				_this.finish_fx();
			}
		}, 1);
	},

	uncover : function() {
		var _this = W_D;
		_this.reset();
		var loop = 0;
		_this.timer = setInterval( function() {
			if( loop < (_this.img1.height - 1)) {
				_this.context.drawImage( _this.canvas,
					0, 1, _this.img2.width, _this.img2.height - loop - 1,
					0, 0, _this.img2.width, _this.img2.height - loop - 1
				);
				_this.context.drawImage( _this.img1,
					0, _this.img1.height - loop - 1, _this.img1.width, 1,
					0, _this.img1.height - loop - 1, _this.img1.width, 1
				);
				loop += 1;
			} else {
				_this.finish_fx();
			}
		}, 1);
	},

	venetianblind : function() {
		var _this = W_D;
		_this.reset();
		var loop = 0;
		var slats = 8;
		var h = parseInt(_this.img1.height / slats);
		_this.timer = setInterval( function() {
			if( loop < h ) {
				for( loop2 = 0; loop2 < slats; loop2++ ) {
					y = loop2 * h + loop;
					_this.context.drawImage( _this.img1,
						0, y, _this.img1.width, 1,
						0, y, _this.img1.width, 1
					);
				}
				loop += 1;
			} else {
				_this.finish_fx();
			}
		}, 5);
	},
}
