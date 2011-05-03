/*
Canvas Wipes & Dissolves
Carlos R. Tirado - 2011
*/
Wipes_and_Dissolves = function(params) {
	this.canvas = params.canvas; // ph_drawing
	this.context = this.canvas.getContext('2d');
	this.img1 = params.img1; // photo
	this.img2 = params.img2; // drawing_src
	this.vars = { timer: null, loop1: 0, loop2: 0 };
	this.source = { x: 0, y: 0, width: 0, height: 0 };
	this.destination = { x: 0, y: 0, width: 0, height: 0 };
	this.context.drawImage( this.img2, 0, 0 ); // initialized

	Wipes_and_Dissolves.prototype.reset = function() {
		if( this.vars.timer ) { clearInterval( this.vars.timer ); }
		this.source.width = this.img1.width;
		this.source.height = this.img1.height;
	};

	/* Effects: */
	Wipes_and_Dissolves.prototype.fx_random = function() {
		this.reset();
		// divvy up canvas in a 20x20 grid (400 squares)
// this of course should be configurable
		var grid = new Array();
		for( i = 0; i < 400; i++ ) { grid[ i ] = i; }
		this.vars.loop1 = 399; 
		this.vars.timer = setInterval( function() {
// problem here relying on global wp instead of 'this'
// conflict of context within interval, to fix
			if( 0 <= wp.vars.loop1 ) {
				r = Math.floor( Math.random() * wp.vars.loop1 );
				wp.vars.loop2 = grid[ r ];
				grid[ r ] = grid[ wp.vars.loop1 ];
				x = ( wp.vars.loop2 % 20 ) * Math.floor( wp.source.width / 20 );
				y = Math.floor( wp.vars.loop2 / 20 ) * Math.floor( wp.source.height / 20 );
				w = Math.floor( wp.source.width / 20 );
				h = Math.floor( wp.source.height / 20 );
				// one-to-one equivalency between source and destination
				wp.context.drawImage( wp.img1, x, y, w, h, x, y, w, h );
				wp.vars.loop1 -= 1;
// debugging:
// console.log( 'x: '+x+', y: '+y+' -loop: '+wp.vars.loop2);
			} else {
				clearInterval( wp.vars.timer );
			}
		}, 1 );
	};
}

