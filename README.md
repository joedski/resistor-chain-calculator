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
// = [ 12375, 3825, 1237.4999999999998, 562.5 ]
// Or, 12kΩ, 3.8kΩ, 1.2kΩ, 560Ω.
// Or e12 preferred values: 12kΩ, 3.9kΩ, 1.2kΩ, 560Ω.
// This gives a total 17.66kΩ, close to 18kΩ, off by 1.8%, smaller than the 5% error of the e12 series.
```



Method
------

Ohm's Law: V = IR

Given:
- Voltage Steps of Chain
- Total Resistance of Chain

We can derive:
- Total voltage drop of Chain (First step less the last step)
- The voltage drop between each voltage step
- Current going through whole chain, and therefore going through each step

Now that we know the current through the chain, it's trivial to derive the resistance that produces each voltage.

Where:
- n is the number of voltage steps
- ∆V[i] = V[i-1] - V[i]
- V[0] is the positive most voltage step
- V[n] is the negative most voltage step

We get:
- R[i] = ∆V[i] / I for i = 1 .. n

### Rationale

Given Ohm's Law, 2 values must be known to calculate the third.  Since I am not interested in a specific current when creating voltage references, that leaves voltage and resistance, so both of those must be provided as input.

Also, I was bored.
