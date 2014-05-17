/*
	Canvas Wipes & Dissolves
	Carlos R. Tirado - 2011
*/

// setup namespace W_D (for Wipes and Dissolves)
var W_D = (function() {

	var canvas = null;
	var context = null;
	var img1 = null;
	var img2 = null;
	this.timer = null;
	this.busy = false;
	this.fx_list = [];

	// W_D must be setup before effects can be called.
	// need two images (transition one to the other), and a <canvas> element
	this.setup = function( params ) {
		canvas = params.canvas;
		img1 = params.img1;
		img2 = params.img2;
		context = canvas.getContext('2d');
		context.drawImage( img1, 0, 0 ); // show first image
		for( var i in this.fx ) { fx_list.push( i ); }
	}
	this.reset = function() {
		if( timer ) { clearInterval( timer ); }
		busy = true;
		// temp. flip img1 & img2
		var tmp = img1.src;
		img1.src = img2.src;
		img2.src = tmp;
	}
	this.finish_fx = function() {
		context.drawImage( img1, 0, 0 );
		busy = false;
		clearInterval( timer );
	}

	this.slideshow = function(reps) {
		(function(reps) {
			r = Math.floor( Math.random() * fx_list.length );
			fx[ fx_list[r]]();
			var itv = setInterval( function() {
				if( !busy ) {
					reps -= 1;
					if( 0 < reps ) {
						// pause one second before next slide
						ti = new Date(); while ((new Date()) - ti <= 1000) { /* idle */ }
						r = Math.floor( Math.random() * fx_list.length );
						fx[ fx_list[r]]();
					} else { clearInterval( itv ); }
				}
			}, 1000);
		}(reps));
	}
	/* Effects: */
	this.fx = {
		iris : function() {
			var loop = 0;
			reset();
			timer = setInterval( function() {
				if( loop < 200 ) {
					x =  img1.width  / 2 - loop * img1.width / 400;
					y =  Math.floor(img1.height / 2 - loop * img1.height / 400);
					w = ((img1.width  / 2 - x ) * 2) || 1;
					h = Math.floor((img1.height / 2 - y ) * 2);
					context.drawImage( img1, x, y, w, h, x, y, w, h );
					loop += 1;
				} else {
					finish_fx();
				}
			}, 1 );
		},

		random : function() {
			reset();
			var grid_size = 20; // default 20 x 20 grid
			if( 0 < arguments.length && 0 < arguments[0] ) {
				grid_size = arguments[0];
			}
			var grid = new Array();
			for( var i = 0; i < (grid_size * grid_size); i++ ) { grid[ i ] = i; }
			var loop = (grid_size * grid_size) - 1;
			timer = setInterval( function() {
				if( 0 <= loop ) {
					r = Math.floor( Math.random() * loop );
					loop2 = grid[ r ];
					grid[ r ] = grid[ loop ];
					x = ( loop2 % grid_size ) * Math.floor( img1.width / grid_size );
					y = Math.floor( loop2 / grid_size ) * Math.floor( img1.height / grid_size );
					w = Math.floor( img1.width / grid_size );
					h = Math.floor( img1.height / grid_size );
					context.drawImage( img1, x, y, w, h, x, y, w, h );
					loop -= 1;
				} else {
					finish_fx();
				}
			}, 1);
		},

		cross : function() {
			reset();
			var loop = 0;
			var w = img1.width  / 40;
			var h = img1.height / 40;
			timer = setInterval( function() {
				if( loop < 20 ) {
					/* individually each Quadrant could be a from-corner transition */
					x = loop * w;
					y = loop * h;
					// NW Quadrant
					context.drawImage( img1, 0, y, w * (loop + 1), h, 0, y, w * (loop + 1), h );
					context.drawImage( img1, x, 0, w, h * (loop + 1), x, 0, w, h * (loop + 1));
					// SW Quadrant
					y = img1.height - h * (loop + 1);
					context.drawImage( img1, w * loop, y, w, h * (loop + 1), w * loop, y, w, h * (loop + 1));
					context.drawImage( img1, 0, y, w * (loop + 1), h, 0, y, w * (loop + 1), h );
					// SE Quadrant /* vary width and y, x img.width - width */
					x = img1.width - w * (loop + 1);
					context.drawImage( img1, x, y, w, h * (loop + 1), x, y, w, h * (loop + 1));
					context.drawImage( img1, x, y, w * (loop + 1), h, x, y, w * (loop + 1), h );
					// NE Quadrant
					y = 0;
					context.drawImage( img1, x, y, w, h * (loop + 1), x, y, w, h * (loop + 1));
					context.drawImage( img1, x, h * loop, w * (loop + 1), h, x, h * loop, w * (loop + 1), h);
					loop += 1;
				} else {
					finish_fx();
				}
			}, 33);
		},

		assemble : function() {
			reset();
			var loop = 0;
			var w = img1.width / 40;
			var h = img1.height / 8;
			timer = setInterval( function() {
				if( loop < 40 ) {
					for( loop2=0; loop2<8; loop2++ ) {
						y = loop2 * h;
						if( 0 == loop2 % 2 ) {
							x = loop * img1.width / 40;
						} else {
							x = img1.width - loop * img1.width / 40 - img1.width / 40;
						}
						context.drawImage( img1, x, y, w, h, x, y, w, h );
					}
					loop += 1;
				} else {
					finish_fx();
				}
			}, 10);
		},

		checkerboard : function() {
			reset();
			var loop = 0;
			var w = Math.floor( img1.width / 10 );
			var h = Math.floor( img1.height / 10 );
			timer = setInterval( function() {
				if( loop < 100 ) {
					loop2 = loop * 2 - (49 < loop ? 99 : 0);
					x = (loop2 % 10) * w + (1 == (Math.floor(loop2 / 10) % 2) ? w : 0)
						- (1 == (Math.floor(loop2 / 10) % 2) && 49 < loop ? 2 * w : 0);
					y = Math.floor(loop2 / 10) * h;
					context.drawImage( img1, x, y, w, h, x, y, w, h );
					loop += 1;
				} else {
					finish_fx();
				}
			}, 10);
		},

		rollup : function() {
			reset();
			var loop = 1;
			var roll_h = Math.floor(img1.height / 5); // << 20% height 
			var scr_copy = new Image; scr_copy.src = img2.src;
			var w = img1.width;
			var h = img1.height;
			timer = setInterval( function() {
				if( loop < h - 1 ) {
					if( loop < roll_h ) {
						// start roll up, pull bottom edge to roll_h
						context.drawImage( canvas, 0, h - (loop + loop - 1), w, loop, 0, img1.height - (loop + loop + 1), w, loop);
						context.drawImage( scr_copy, 0, h - (loop + 1), w, 1, 0, h - (loop + 1), w, 1);
						context.drawImage( img1, 0, h - loop, w, 1, 0, h - loop, w, 1);
					} else if( loop > (h - roll_h)) {
						// hit top of screen, gradually remove remaining roll
						context.drawImage( canvas, 0, 2, w, (h - loop - 1), 0, 0, w, (h - loop - 1));
						context.drawImage( scr_copy, 0, h - loop - 1, w, 1, 0, h - loop - 1, w, 1);
						context.drawImage( img1, 0, h - loop, w, 1, 0, h - loop, w, 1);
					} else {
						// lifted portion can roll unto itself
						context.drawImage( canvas, 0, h - loop - roll_h + 2, w, roll_h - 1, 0, h - loop - roll_h, w, roll_h - 1);
						context.drawImage( scr_copy, 0, h - loop - 1, w, 1, 0, h - loop - 1, w, 1);
						context.drawImage( img1, 0, h - loop, w, 1, 0, h - loop, w, 1);
					}
					loop += 1;
				} else {
					finish_fx();
				}
			}, 10);
		},

		rolldown : function() {
			reset();
			var loop = 1;
			var roll_h = Math.floor(img1.height / 5); // << 20% height 
			timer = setInterval( function() {
				w = img1.width; h = img1.height;
				if( loop < h - 1) {
					if( loop < roll_h ) {
						// start roll down
						context.drawImage( canvas, 0, 0, w, loop, 0, 2, w, loop);
						context.drawImage( img1, 0, loop * 2 + 1, w, 1, 0, 1, w, 1);
						context.drawImage( img1, 0, loop * 2 + 2, w, 1, 0, 0, w, 1);
					} else if( loop >= roll_h && loop < (h - roll_h - 1)) {
						// unroll
						context.drawImage( canvas, 0, loop - roll_h, w, roll_h - 1, 0, loop - roll_h + 2, w, roll_h - 1);
						context.drawImage( img1, 0, loop + roll_h + 1, w, 1, 0, loop - roll_h + 1, w, 1);
						context.drawImage( img1, 0, loop - roll_h, w, 1, 0, loop - roll_h, w, 1);
					} else {
						// getting to bottom of screen, unroll tail of image
						y = h - loop;
						context.drawImage( canvas, 0, loop - y + 1, w, y - 1, 0, loop - y + 3, w, y - 1);
						context.drawImage( img1, 0, loop - y, w, 2, 0, loop - y, w, 2);
					}
					loop += 1;
				} else {
					finish_fx();
				}
			}, 1);
		},

		cover : function() {
			reset();
			var loop = 1;
			timer = setInterval( function() {
				if( loop < img1.height ) {
					context.drawImage( img1, 0, img1.height-loop, img1.width, loop,
						0, 0, img1.width, loop );
					loop += 1;
				} else {
					finish_fx();
				}
			}, 1);
		},

		uncover : function() {
			reset();
			var loop = 0;
			timer = setInterval( function() {
				if( loop < (img1.height - 1)) {
					context.drawImage( canvas,
						0, 1, img2.width, img2.height - loop - 1,
						0, 0, img2.width, img2.height - loop - 1
					);
					context.drawImage( img1,
						0, img1.height - loop - 1, img1.width, 1,
						0, img1.height - loop - 1, img1.width, 1
					);
					loop += 1;
				} else {
					finish_fx();
				}
			}, 1);
		},

		venetianblind : function() {
			reset();
			var loop = 0;
			var slats = 8;
			var h = parseInt(img1.height / slats);
			timer = setInterval( function() {
				if( loop < h ) {
					for( loop2 = 0; loop2 < slats; loop2++ ) {
						y = loop2 * h + loop;
						context.drawImage( img1,
							0, y, img1.width, 1,
							0, y, img1.width, 1
						);
					}
					loop += 1;
				} else {
					finish_fx();
				}
			}, 5);
		},
	}

	return this;

}());

