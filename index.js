
module.exports = function resistorChain( rTotal, voltages ) {
	var vGround = voltages[ voltages.length - 1 ];
	var vTotal = voltages[ 0 ] - vGround;

	return voltages.reduceRight( function( resistors, vi, iv ) {
		var ri;

		// skip the low/negative/ground rail.
		if( iv >= voltages.length - 1 ) return resistors;

		ri = (vi - vGround) / (vTotal - vGround) * rTotal - resistors.reduce( sum );

		return [ ri ].concat( resistors );
	}, [] );
};

function sum( t, n ) {
	return t + n;
}
