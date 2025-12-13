# Introduction

Goal 1: Calculate the equivalent static deflection of a pavement system from a dynamic load test as compared to a static load test.

Goal 2: From the static deflection of a pavement system, calculate the system modulus of elasticity, using Boussinesq one layer theory or if the pavement layers are known, using multiple elastic layer theory and calculating the sub grade modulus of elasticity.

Goal 3: Determine remaining life with the change in modulus of elasticity based on stress/deformation of pavement.

A force acting on a spring causes a displacement.
The relationship between the force and displacement is determined experimentally.
If the force is proportional to the displacement, then the relationship is expressed as
$F = k * x$, which is known as Hooke's Law.

How to find $k$: 
1. Static Load Test with device under test suitably constrained so that there is no rigid body motion.
When system is at rest and in static equilibrium, apply a known force and measure the displacement after system again reaches static equilibrium. If the displacement is small enough then the ratio of $x / F$ is equal to $1 / k$, the inverse of the stiffness, $k$ or the flexibility.
This type of static load test is not intended to determine the ultimate strength.
For laboratory tests, the displacement is measurable because there typically is a reference point.
For pavement field tests, with pavements of almost infinite length, the displacement is measured with respect to a straight edge of finite length.

2. Dynamic Load Test with device under test suitably constrained so that there is no rigid body motion.
When a sine force is applied to the system, the system responds in a steady state with a constant amplitude and a different constant sine phase. The system is in dynamic equilibrium. The constant amplitude is the displacement around the static equilibrium displacement. This is known as a stepped-sine forced vibration dynamic test.
Introducing the time, $t$ variable, the equation of motion of dynamic equilibrium is
$F * f(t) = m * d^2(x(t)) / d^2(t) + c * d(x(t)) / d(t) + k * x(t)$
where $f(t) = sin(2 * pi * frequency * t)$ and $x(t) = X(i * 2 * pi * frequency) * sin(2 * pi * frequency * t)$
where $m$ represents the system mass, $c$ represents the system damping and $k$ represents the system stiffness.

Note: $X$ is a complex function with magnitude, $|X|$ and phase, $\theta$ and $x(t) = |X| * sin(2 * pi * frequency * t + \theta)$.
$X$ is known as the frequency response function with frequency as a variable and mathematically is 
$X = 1 / (k - \omega^2 m + i * \omega * c)$ where $\omega = 2 * pi * frequency$.

Note: when $\omega$ is zero, the frequency response function mathematically is $1 / k$.
Physically, test wise, it is not possible to have a sine at $\omega$ equal to zero.
An alternate expression for the frequency response function is as a rational fractional polynomial
$X = (numerator\ polynomial) / (denominator\ polynomial)$ which can be represented mathematically as function of the residues and poles.
$X = A / (i * \omega - s) + A^* / (i * \omega - s^*)$.

Note: when $\omega$ is zero, $X = - A / s - A^* / s^*$.
From the theoretical equation of motion of dynamic equilibrium, the residues, $A$ and the poles, $s$ are known and when substituted,
$X = - A / s - A^* / s^* == 1 / k$.

Why is this important?

From experimental modal analysis, complex values, the residues, $A$ and poles, $s$ can be identified from curve fitting the experimental frequency response function and therefore the inverse of the system stiffness can be calculated.
For systems with multiple degrees of freedom, the $m, c, k$ variables become matrices and the $f(t)$ and $x(t)$ functions become vectors with respect to time.
For pavements, this approach to calculating the inverse of the stiffness does not require knowledge of the mode shapes, which would require testing at different locations on/in the pavement. From a single test, the residues do contain the mode shape information but not in an accessible way and the poles, the natural frequencies.

A positive feature of this type of test, is that different load weights can be used but after applying the zero to $\omega$, the inverse of the stiffness is mass independent. 
Note that with different load weights, the natural frequencies and mode shapes ($A$ and $s$ also) will change but the system stiffness will not. Also need not be concerned with extraneous mass loading as that is taken into account with the change in natural frequencies and mode shapes but once again, the system stiffness will not change.

Another advantage, is the residues and poles contain the actual damping conditions and not just a theoretical model of damping using proportional or non-proportional damping.

