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
	vars : { timer: null, loop1: 0, loop2: 0 },
	source : { x: 0, y: 0, width: 0, height: 0 },
	destination : { x: 0, y: 0, width: 0, height: 0 },
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
	if( this.vars.timer ) { clearInterval( this.vars.timer ); }
	this.source.width = this.img1.width;
	this.source.height = this.img1.height;
}
/* Effects: */
W_D.fx_random = function() {
	this.reset();
// this of course should be configurable:
	// divvy up canvas in a 20x20 grid (400 squares)
	var grid = new Array();
	for( var i = 0; i < 400; i++ ) { grid[ i ] = i; }
	this.vars.loop1 = 399;
	this.vars.timer = setInterval( function() {
		if( 0 <= W_D.vars.loop1 ) {
			r = Math.floor( Math.random() * W_D.vars.loop1 );
			W_D.vars.loop2 = grid[ r ];
			grid[ r ] = grid[ W_D.vars.loop1 ];
			x = ( W_D.vars.loop2 % 20 ) * Math.floor( W_D.source.width / 20 );
			y = Math.floor( W_D.vars.loop2 / 20 ) * Math.floor( W_D.source.height / 20 );
			w = Math.floor( W_D.source.width / 20 );
			h = Math.floor( W_D.source.height / 20 );
			// one-to-one equivalency between source and destination
			W_D.context.drawImage( W_D.img1, x, y, w, h, x, y, w, h );
			W_D.vars.loop1 -= 1;
		} else {
			clearInterval( W_D.vars.timer );
		}
	});
}

