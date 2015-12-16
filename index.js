
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
