Resistor Chain Calculator
=========================

Given a list of desired voltage steps, in sorted order, and a total resistance drop over the whole chain, calculate the value of each resistor between each step.

I wanted to make a simple peak meter and needed a resistor chain.



Use
---

Note: The Voltage list must have all voltages in the same unit. (volts, millivolts, etc.)  I recommend sticking to volts.  Resistances will all be returned relative to the same unit as the provided voltage.  I recommend sticking with ohms.

- `resistorChain( rTotal, voltages ) -> resistors`
	- Return Value: `Array<Number>` giving the resistance between each voltage step.  Because it's between each voltage step, it will have 1 fewer values.
	- `rTotal`: `Number` indicating the total resistance the whole chain should drop between the first and final voltage step.
	- `voltages`: `Array<Number>` telling `resistorChain` what voltage steps you want, including the positive rail as the first voltage and the lesser/negative/ground rail as the last step.
		- This means if you want to be between the supply voltage and ground, the first value must be the supply voltage while the last is ground, like `[VSupply, 2.5, 1, 0]`.
		- Voltages must be provided in descending order.  Doing otherwise will result in negative resistances.  I mean, you _can_ do that, but that's rather space and power inefficient.

```js
var resistorChain = require( 'resistor-chain-calculator' );

// Resistor chain for a supply of 3.2V, steps at 1V, 320mV, and 100mV, and true ground being 0V,
// where the total resistance of the chain is 18kΩ.
var resistors = resistorChain( 18e3, [ 3.2, 1, 320e-3, 100e-3, 0 ] );
// = []
```



Method
------

Given:
- n: Count of resistors, and count of voltage steps less 1.
- V[1], V[2], ... V[n], VGnd: Voltage steps, where V[1] is also the positive supply rail, and VGnd is either ground or the lower (or negative) supply rail.
- RT: The total resistance of the chain.

Find:
- R1, R2, ... RN: Each resistor after the same numbered voltage step.

Steps:
1. V[n] is trivial, as it is a single resistor forming its voltage divider:
	- V[n] = (V[1] - VGnd) * R[n] / RT + VGnd
	- R[n] = (V[n] - VGnd) / (V[1] - VGnd) * RT
	- Note that where VGnd really is 0V, it simplifies to the typical voltage divider.
2. V[n-1] can then be calculated as R[n] is known, but R[n-1] is not.
	- V[n-1] = (V[1] - VGnd) * (R[n-1] + R[n]) / RT + VGnd
	- V[n-1] = (V[1] - VGnd) * (R[n-1] / RT + R[n] / RT) + VGnd
	- R[n-1] / RT + R[n] / RT = (V[n-1] - VGnd) / (V[1] - VGnd)
	- R[n-1] + R[n] = (V[n-1] - VGnd) / (V[1] - VGnd) * RT
	- R[n-1] = (V[n-1] - VGnd) / (V[1] - VGnd) * RT - R[n]
3. V[n-2] can be then seen to work out to:
	- R[n-2] = (V[n-2] - VGnd) / (V[1] - VGnd) * RT - R[n] - R[n-1]
4. From here we can generalize:
	- R[i] = (V[i] - VGnd) / (V[1] - VGnd) * RT - (∑[j = i+1 .. n] R[j])
	- Where when i = n, (∑[j = i+1 .. n] R[j]) = 0, as there is no resistance between a rail/ground and itself, thus yielding this, Step 1:
		- R[n] = (V[n] - VGnd) / (V[1] - VGnd) * RT
	- Where when i = 1, v[i] is v[1], simplifying to:
		- R[1] = (V[1] - VGnd) / (V[1] - VGnd) * RT - (∑[j = 2 .. n] R[j])
		- R[1] = 1 * RT - (∑[j = 2 .. n] R[j])
		- Which is just the total resistance minus the other resistors, which is logically the only resistor left to find.

### Rationale

Given Ohm's Law, 2 values must be known to calculate the third.  Since I am not interested in current when creating voltage references, that leaves voltage and resistance, so both of those must be provided as input.
