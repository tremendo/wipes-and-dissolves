/*
Canvas Wipes & Dissolves
Carlos R. Tirado - 2011
*/
// setup global W_D (for Wipes and Dissolves) object and initialize
var W_D = {
	canvas: null,
	context: null,
	img1: null,
	img2: null,
	timer: null,
}
// W_D must be setup before effects can be called.
// need two images (transition one to the other), and a <canvas> element
W_D.setup = function( params ) {
	this.canvas = params.canvas;
	this.img1 = params.img1;
	this.img2 = params.img2;
	this.context = this.canvas.getContext('2d');
	this.context.drawImage( this.img2, 0, 0 ); // initialized
}
W_D.reset = function() {
	if( this.timer ) { clearInterval( this.timer ); }
}

/* Effects: */
W_D.fx_iris = function() {
	this.reset();
	var loop = 0;
	this.timer = setInterval( function() {
		if( loop < 200 ) {
			x = W_D.img1.width / 2 - loop * W_D.img1.width / 400;
			y = W_D.img1.height / 2 - loop * W_D.img1.height / 400;
			w = (W_D.img1.width / 2 - x ) * 2;
			h = (W_D.img1.height / 2 - y ) * 2;
			W_D.context.drawImage( W_D.img1, x, y, w, h, x, y, w, h );
			loop += 1;
		} else {
			W_D.context.drawImage( W_D.img1, 0, 0 );
			clearInterval( W_D.timer );
		}
	}, 1 );
}

W_D.fx_random = function() {
	this.reset();
// this of course should be configurable:
	// divvy up canvas in a 20x20 grid (400 squares)
	var grid = new Array();
	for( var i = 0; i < 400; i++ ) { grid[ i ] = i; }
	var loop = 399;
	this.timer = setInterval( function() {
		if( 0 <= loop ) {
			r = Math.floor( Math.random() * loop );
			loop2 = grid[ r ];
			grid[ r ] = grid[ loop ];
			x = ( loop2 % 20 ) * Math.floor( W_D.img1.width / 20 );
			y = Math.floor( loop2 / 20 ) * Math.floor( W_D.img1.height / 20 );
			w = Math.floor( W_D.img1.width / 20 );
			h = Math.floor( W_D.img1.height / 20 );
			W_D.context.drawImage( W_D.img1, x, y, w, h, x, y, w, h );
			loop -= 1;
		} else {
			clearInterval( W_D.timer );
		}
	});
}

W_D.fx_cross = function() {
	this.reset();
	var loop = 0;
	this.timer = setInterval( function() {
		if( loop <= 20 ) {
			w = loop * W_D.img1.width / 40 + 1;
			h = loop * W_D.img1.height / 40;
			x = 0; y = 0;
			W_D.context.drawImage( W_D.img1, x, y, w, h, x, y, w, h );
			y = W_D.img1.height - h;
			W_D.context.drawImage( W_D.img1, x, y, w, h, x, y, w, h );
			x = W_D.img1.width - w - 1;
			W_D.context.drawImage( W_D.img1, x, y, w, h, x, y, w, h );
			y = 0;
			W_D.context.drawImage( W_D.img1, x, y, w, h, x, y, w, h );
			loop += 1;
		} else {
			W_D.context.drawImage( W_D.img1, 0, 0 );
			clearInterval( W_D.timer );
		}
	}, 40);
}

W_D.fx_assemble = function() {
	this.reset();
	var loop = 0;
	var w = this.img1.width / 40;
	var h = this.img1.height / 8;
	this.timer = setInterval( function() {
		if( loop < 40 ) {
			for( loop2=0; loop2<8; loop2++ ) {
				y = loop2 * h;
				if( 0 == loop2 % 2 ) {
					x = loop * W_D.img1.width / 40;
				} else {
					x = W_D.img1.width - loop * W_D.img1.width / 40 - W_D.img1.width / 40;
				}
				W_D.context.drawImage( W_D.img1, x, y, w, h, x, y, w, h );
			}
			loop += 1;
		} else {
			W_D.context.drawImage( W_D.img1, 0, 0 );
			clearInterval( W_D.timer );
		}
	}, 10);
}

W_D.fx_checkerboard = function() {
	this.reset();
	var loop = 0;
	var w = Math.floor( this.img1.width / 10 );
	var h = Math.floor( this.img1.height / 10 );
	this.timer = setInterval( function() {
		if( loop < 100 ) {
			loop2 = loop * 2 - (49 < loop ? 99 : 0);
			x = (loop2 % 10) * w + (1 == (Math.floor(loop2 / 10) % 2) ? w : 0)
				- (1 == (Math.floor(loop2 / 10) % 2) && 49 < loop ? 2 * w : 0);
			y = Math.floor(loop2 / 10) * h;
			W_D.context.drawImage( W_D.img1, x, y, w, h, x, y, w, h );
			loop += 1;
		} else {
			clearInterval( W_D.timer );
		}
	}, 10);
}

W_D.fx_rollup = function() {
	this.reset();
	var roll_h = Math.floor(W_D.img1.height / 5); // << 20% height 
	var scr_copy = new Image; scr_copy.src = W_D.img2.src;
	var w = this.img1.width;
	var h = this.img1.height;
	var loop = 1;
	this.timer = setInterval( function() {
		if( loop < h - 1 ) {
			if( loop < roll_h ) {
				// start roll up, pull bottom edge to roll_h
				W_D.context.drawImage( W_D.canvas, 0, h - (loop + loop - 1), w, loop, 0, W_D.img1.height - (loop + loop + 1), w, loop);
				W_D.context.drawImage( scr_copy, 0, h - (loop + 1), w, 1, 0, h - (loop + 1), w, 1);
				W_D.context.drawImage( W_D.img1, 0, h - loop, w, 1, 0, h - loop, w, 1);
			} else if( loop > (h - roll_h)) {
				// hit top of screen, gradually remove remaining roll
				W_D.context.drawImage( W_D.canvas, 0, 2, w, (h - loop - 1), 0, 0, w, (h - loop - 1));
				W_D.context.drawImage( scr_copy, 0, h - loop - 1, w, 1, 0, h - loop - 1, w, 1);
				W_D.context.drawImage( W_D.img1, 0, h - loop, w, 1, 0, h - loop, w, 1);
			} else {
				// lifted portion can roll unto itself
				W_D.context.drawImage( W_D.canvas, 0, h - loop - roll_h + 2, w, roll_h - 1, 0, h - loop - roll_h, w, roll_h - 1);
				W_D.context.drawImage( scr_copy, 0, h - loop - 1, w, 1, 0, h - loop - 1, w, 1);
				W_D.context.drawImage( W_D.img1, 0, h - loop, w, 1, 0, h - loop, w, 1);
			}
			loop += 1;
		} else {
			W_D.context.drawImage( W_D.img1, 0, 0 );
			clearInterval( W_D.timer );
		}
	}, 10);
}

W_D.fx_rolldown = function() {
	this.reset();
	var roll_h = Math.floor(this.img1.height / 5); // << 20% height 
	var loop = 1;
	this.timer = setInterval( function() {
		w = W_D.img1.width; h = W_D.img1.height;
		if( loop < h - 1) {
			if( loop < roll_h ) {
				// start roll down
				W_D.context.drawImage( W_D.canvas, 0, 0, w, loop, 0, 2, w, loop);
				W_D.context.drawImage( W_D.img1, 0, loop * 2 + 1, w, 1, 0, 1, w, 1);
				W_D.context.drawImage( W_D.img1, 0, loop * 2 + 2, w, 1, 0, 0, w, 1);
			} else if( loop >= roll_h && loop < (h - roll_h - 1)) {
				// unroll
				W_D.context.drawImage( W_D.canvas, 0, loop - roll_h, w, roll_h - 1, 0, loop - roll_h + 2, w, roll_h - 1);
				W_D.context.drawImage( W_D.img1, 0, loop + roll_h + 1, w, 1, 0, loop - roll_h + 1, w, 1);
				W_D.context.drawImage( W_D.img1, 0, loop - roll_h, w, 1, 0, loop - roll_h, w, 1);
			} else {
				// getting to bottom of screen, unroll tail of image
				y = h - loop;
				W_D.context.drawImage( W_D.canvas, 0, loop - y + 1, w, y - 1, 0, loop - y + 3, w, y - 1);
				W_D.context.drawImage( W_D.img1, 0, loop - y, w, 2, 0, loop - y, w, 2);
			}
			loop += 1;
		} else {
			W_D.context.drawImage( W_D.img1, 0, 0 );
			clearInterval( W_D.timer );
		}
	}, 1);
}

W_D.fx_cover = function() {
	this.reset();
	var loop = 0;
	this.timer = setInterval( function() {
		if( loop < W_D.img1.height ) {
			W_D.context.drawImage( W_D.img1, 0, W_D.img1.height-loop, W_D.img1.width, loop,
				0, 0, W_D.img1.width, loop );
			loop += 1;
		} else {
			W_D.context.drawImage( W_D.img1, 0, 0 );
			clearInterval( W_D.timer );
		}
	}, 1);
}

W_D.fx_uncover = function() {
	this.reset();
	var loop = 0;
	this.timer = setInterval( function() {
		if( loop < (W_D.img1.height - 1)) {
			W_D.context.drawImage( W_D.canvas,
				0, 1, W_D.img2.width, W_D.img2.height - loop - 1,
				0, 0, W_D.img2.width, W_D.img2.height - loop - 1
			);
			W_D.context.drawImage( W_D.img1,
				0, W_D.img1.height - loop - 1, W_D.img1.width, 1,
				0, W_D.img1.height - loop - 1, W_D.img1.width, 1
			);
			loop += 1;
		} else {
			W_D.context.drawImage( W_D.img1, 0, 0 );
			clearInterval( W_D.timer );
		}
	}, 1);
}

W_D.fx_venetianblind = function() {
	this.reset();
	var loop = 0;
	var slats = 8;
	var h = parseInt(this.img1.height / slats);
	this.timer = setInterval( function() {
		if( loop < h ) {
			for( loop2 = 0; loop2 < slats; loop2++ ) {
				y = loop2 * h + loop;
				W_D.context.drawImage( W_D.img1,
					0, y, W_D.img1.width, 1,
					0, y, W_D.img1.width, 1
				);
			}
			loop += 1;
		} else {
			W_D.context.drawImage( W_D.img1, 0, 0 );
			clearInterval( W_D.timer );
		}
	}, 5);
}

