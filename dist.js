(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

module.exports = function resistorChain( rTotal, voltages ) {
	var vGround = voltages[ voltages.length - 1 ];
	var vTotal = voltages[ 0 ] - vGround;

	return voltages.reduceRight( function( resistors, vi, iv ) {
		var ri;

		// skip the low/negative/ground rail.
		if( iv >= voltages.length - 1 ) return resistors;

		ri = (vi - vGround) / (vTotal - vGround) * rTotal - resistors.reduce( sum, 0 );

		return [ ri ].concat( resistors );
	}, [] );
};

function sum( t, n ) {
	return t + n;
}

},{}]},{},[1]);
