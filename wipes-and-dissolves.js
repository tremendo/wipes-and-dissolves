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
	this.loop = 0;
}

/* Effects: */
W_D.fx_iris = function() {
	this.reset();
	this.timer = setInterval( function() {
		if( W_D.loop < 200 ) {
			x = W_D.img1.width / 2 - W_D.loop * W_D.img1.width / 400;
			y = W_D.img1.height / 2 - W_D.loop * W_D.img1.height / 400;
			w = (W_D.img1.width / 2 - x ) * 2;
			h = (W_D.img1.height / 2 - y ) * 2;
			W_D.context.drawImage( W_D.img1, x, y, w, h, x, y, w, h );
			W_D.loop += 1;
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
	this.loop = 399;
	this.timer = setInterval( function() {
		if( 0 <= W_D.loop ) {
			r = Math.floor( Math.random() * W_D.loop );
			W_D.loop2 = grid[ r ];
			grid[ r ] = grid[ W_D.loop ];
			x = ( W_D.loop2 % 20 ) * Math.floor( W_D.img1.width / 20 );
			y = Math.floor( W_D.loop2 / 20 ) * Math.floor( W_D.img1.height / 20 );
			w = Math.floor( W_D.img1.width / 20 );
			h = Math.floor( W_D.img1.height / 20 );
			W_D.context.drawImage( W_D.img1, x, y, w, h, x, y, w, h );
			W_D.loop -= 1;
		} else {
			clearInterval( W_D.timer );
		}
	});
}

W_D.fx_cross = function() {
	this.reset();
	this.timer = setInterval( function() {
		if( W_D.loop <= 20 ) {
			w = W_D.loop * W_D.img1.width / 40 + 1;
			h = W_D.loop * W_D.img1.height / 40;
			x = 0; y = 0;
			W_D.context.drawImage( W_D.img1, x, y, w, h, x, y, w, h );
			y = W_D.img1.height - h;
			W_D.context.drawImage( W_D.img1, x, y, w, h, x, y, w, h );
			x = W_D.img1.width - w - 1;
			W_D.context.drawImage( W_D.img1, x, y, w, h, x, y, w, h );
			y = 0;
			W_D.context.drawImage( W_D.img1, x, y, w, h, x, y, w, h );
			W_D.loop += 1;
		} else {
			W_D.context.drawImage( W_D.img1, 0, 0 );
			clearInterval( W_D.timer );
		}
	}, 40);
}

W_D.fx_assemble = function() {
	this.reset();
	w = this.img1.width / 40;
	h = this.img1.height / 8;
	this.timer = setInterval( function() {
		if( W_D.loop < 40 ) {
			for( W_D.loop2=0; W_D.loop2<8; W_D.loop2++ ) {
				y = W_D.loop2 * h;
				if( 0 == W_D.loop2 % 2 ) {
					x = W_D.loop * W_D.img1.width / 40;
				} else {
					x = W_D.img1.width - W_D.loop * W_D.img1.width / 40 - W_D.img1.width / 40;
				}
				W_D.context.drawImage( W_D.img1, x, y, w, h, x, y, w, h );
			}
			W_D.loop += 1;
		} else {
			W_D.context.drawImage( W_D.img1, 0, 0 );
			clearInterval( W_D.timer );
		}
	}, 10);
}

W_D.fx_checkerboard = function() {
	this.reset();
	w = Math.floor( this.img1.width / 10 );
	h = Math.floor( this.img1.height / 10 );
	this.timer = setInterval( function() {
		if( W_D.loop < 100 ) {
			W_D.loop2 = W_D.loop * 2 - (49 < W_D.loop ? 99 : 0);
			x = (W_D.loop2 % 10) * w + (1 == (Math.floor(W_D.loop2 / 10) % 2) ? w : 0)
				- (1 == (Math.floor(W_D.loop2 / 10) % 2) && 49 < W_D.loop ? 2 * w : 0);
			y = Math.floor(W_D.loop2 / 10) * h;
			W_D.context.drawImage( W_D.img1, x, y, w, h, x, y, w, h );
			W_D.loop += 1;
		} else {
			clearInterval( W_D.timer );
		}
	}, 10);
}

W_D.fx_rollup = function() {
	this.reset();
	var roll_h = Math.floor(W_D.img1.height / 5); // << 20% height 
	var scr_copy = new Image; scr_copy.src = drawing_src.src;
	x = 0;
	w = this.img1.width;
	h = this.img1.height;
	this.loop = 1;
	this.timer = setInterval( function() {
		if( W_D.loop < h - 1 ) {
			if( W_D.loop < roll_h ) {
				// start roll up, pull bottom edge to roll_h
				W_D.context.drawImage( W_D.img2,
					x, h - (W_D.loop + W_D.loop - 1), w, W_D.loop,
					x, W_D.img1.height - (W_D.loop + W_D.loop + 1), w, W_D.loop
				);
				W_D.context.drawImage( W_D.img2,
					x, h - (W_D.loop + 1), w, 1,
					x, h - (W_D.loop + 1), w, 1
				);
				W_D.context.drawImage( W_D.img1,
					x, h - W_D.loop, w, 1,
					x, h - W_D.loop, w, 1
				);
			} else if( W_D.loop > (h - roll_h)) {
				// hit top of screen, gradually remove remaining roll
				W_D.context.drawImage( W_D.img2,
					x, 2, w, (h - W_D.loop - 1),
					x, 0, w, (h - W_D.loop - 1)
				);
				W_D.context.drawImage( W_D.img1,
					x, h - W_D.loop - 1, w, 1,
					x, h - W_D.loop - 1, w, 1
				);
				W_D.context.drawImage( W_D.img1,
					x, h - W_D.loop, w, 1,
					x, h - W_D.loop, w, 1
				);
			} else {
				// lifted portion can roll unto itself
				W_D.context.drawImage( W_D.img2,
					x, h - W_D.loop - roll_h + 2, w, roll_h - 1,
					x, h - W_D.loop - roll_h, w, roll_h - 1
				);
				W_D.context.drawImage( W_D.img1,
					x, h - W_D.loop - 1, w, 1,
					x, h - W_D.loop - 1, w, 1
				);
				W_D.context.drawImage( W_D.img1,
					x, h - W_D.loop, w, 1,
					x, h - W_D.loop, w, 1
				);
			}
			W_D.loop += 1;
		} else {
			W_D.context.drawImage( W_D.img1, 0, 0 );
			clearInterval( W_D.timer );
		}
	}, 10);
}

W_D.fx_rolldown = function() {
	this.reset();
	this.roll_h = Math.floor(this.img1.height / 5); // << 20% height 
	this.loop = 1;
	this.timer = setInterval( function() {
		x = 0; w = W_D.img1.width; h = W_D.img1.height;
		if( W_D.loop < h - 1) {
			if( W_D.loop < W_D.roll_h ) {
				// start roll down
				W_D.context.drawImage( W_D.img2, x, 0, w, W_D.loop, x, 2, w, W_D.loop);
				W_D.context.drawImage( W_D.img1, x, W_D.loop * 2 + 1, w, 1, x, 1, w, 1);
				W_D.context.drawImage( W_D.img1, x, W_D.loop * 2 + 2, w, 1, x, 0, w, 1);
			} else if( W_D.loop >= W_D.roll_h && W_D.loop < (h - W_D.roll_h - 1)) {
				// unroll
				W_D.context.drawImage( W_D.img2,
					x, W_D.loop - W_D.roll_h, w, W_D.roll_h - 1,
					x, W_D.loop - W_D.roll_h + 2, w, W_D.roll_h - 1
				);
				W_D.context.drawImage( W_D.img1,
					x, W_D.loop + W_D.roll_h + 1, w, 1,
					x, W_D.loop - W_D.roll_h + 1, w, 1
				);
				W_D.context.drawImage( W_D.img1,
					x, W_D.loop - W_D.roll_h, w, 1,
					x, W_D.loop - W_D.roll_h, w, 1
				);
			} else {
				// getting to bottom of screen, unroll tail of image
				y = h - W_D.loop;
				W_D.context.drawImage( W_D.img2,
					x, W_D.loop - y + 1, w, y - 1,
					x, W_D.loop - y + 3, w, y - 1
				);
				W_D.context.drawImage( W_D.img1,
					x, W_D.loop - y, w, 2,
					x, W_D.loop - y, w, 2
				);
			}
			W_D.loop += 1;
		} else {
			W_D.context.drawImage( W_D.img1, 0, 0 );
			clearInterval( W_D.timer );
		}
	}, 5);
}

W_D.fx_cover = function() {
	this.reset();
	this.timer = setInterval( function() {
		if( W_D.loop < W_D.img1.height ) {
			W_D.context.drawImage( W_D.img1, 0, W_D.img1.height-W_D.loop, W_D.img1.width, W_D.loop,
				0, 0, W_D.img1.width, W_D.loop );
			W_D.loop += 1;
		} else {
			W_D.context.drawImage( W_D.img1, 0, 0 );
			clearInterval( W_D.timer );
		}
	}, 1);
}

W_D.fx_uncover = function() {
	this.reset();
	this.timer = setInterval( function() {
		if( W_D.loop < (W_D.img1.height - 1)) {
			W_D.context.drawImage( W_D.canvas,
				0, 1, W_D.img2.width, W_D.img2.height - W_D.loop - 1,
				0, 0, W_D.img2.width, W_D.img2.height - W_D.loop - 1
			);
			W_D.context.drawImage( W_D.img1,
				0, W_D.img1.height - W_D.loop - 1, W_D.img1.width, 1,
				0, W_D.img1.height - W_D.loop - 1, W_D.img1.width, 1
			);
			W_D.loop += 1;
		} else {
			W_D.context.drawImage( W_D.img1, 0, 0 );
			clearInterval( W_D.timer );
		}
	}, 1);
}

W_D.fx_venetianblind = function() {
	this.reset();
	x = 0;
	w = this.img1.width;
	slats = 8;
	h = parseInt(this.img1.height / slats);
	this.timer = setInterval( function() {
		if( W_D.loop < h ) {
			for( W_D.loop2 = 0; W_D.loop2 < slats; W_D.loop2++ ) {
				y = W_D.loop2 * h + W_D.loop;
				W_D.context.drawImage( W_D.img1, x, y, w, 1, x, y, w, 1);
			}
			W_D.loop += 1;
		} else {
			W_D.context.drawImage( W_D.img1, 0, 0 );
			clearInterval( W_D.timer );
		}
	}, 5);
}

