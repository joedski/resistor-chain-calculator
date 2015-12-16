require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"resistor-chain-calculator":[function(require,module,exports){

module.exports = function resistorChain( chainResistance, voltages ) {
	var voltageGround = voltages[ voltages.length - 1 ];
	var chainVoltageDrop = voltages[ 0 ] - voltageGround;

	var current = chainVoltageDrop / chainResistance;

	return voltages.reduce( function( drops, vi, i ) {
		if( i === 0 ) return drops;

		var vprev = voltages[ i - 1 ];
		var vdrop = vprev - vi;

		return drops.concat([ vdrop / current ]);
	}, [] );
};

function sum( t, n ) {
	return t + n;
}

},{}]},{},[]);
