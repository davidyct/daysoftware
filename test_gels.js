/* MIT License
Copyright 2020 David Yang
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var daygels = require('./js/daygels.js');
var opwgt = 170000.0;
var wgt = 0.2309;
var psi = 170.0;
var vehicle = [0.0, Math.sqrt(opwgt * wgt / (Math.PI * psi)), opwgt, wgt, psi];
var zerowheel = [0.0, 0.0, 0.0, 0.0, 0.0];
var xwheel = [0.0, 0.0, -34.0, 191.0, 225.0];
var ywheel = [0.0, 0.0, 0.0, 0.0, 0.0];
var wheels = [zerowheel, xwheel, ywheel];
var xout = 0.0;
var yout = 0.0;
var output = [0.0, xout, yout];
var zeropavement = [0.0, 0.0, 0.0, 0.0, 0.0];
var th = [0.0, 4.0, 8.0, 8.0, 999.0];
var ev = [0.0, 180000.0, 3000000.0, 30000.0, 8000.0];
var pavement = [zeropavement, th, ev]
var results = daygels.gels(vehicle, wheels, output, pavement);
var ts = results[0];
var zz = results[1];
var l = 0;
console.log('Layer\tz (in)\tSxx (psi)\tSxy (psi)\tSyy (psi)\tSzz (psi)\tWz (in)')
for (var iz = 1; iz < zz.length; iz++) {
    if (iz % 2 === 1) l++
    console.log(l.toFixed(0) + '\t' + zz[iz].toFixed(2) + '\t' + ts[1][iz].toFixed(2) + '\t\t' + ts[2][iz].toFixed(2) + '\t\t' + ts[4][iz].toFixed(2) + '\t\t' + ts[6][iz].toFixed(2) + '\t\t' + ts[7][iz].toFixed(6))
}

/*
node test_gels.js
Layer	z (in)	Sxx (psi)	Sxy (psi)	Syy (psi)	Szz (psi)	Wz (in)
1	0.00	-105.10		0.00		-120.91		-170.84		0.093441
1	4.00	-78.61		0.00		-86.80		-164.12		0.090658
2	4.00	-450.66		0.00		-598.90		-164.12		0.090658
2	12.00	468.80		0.00		624.64		-12.42		0.090420
3	12.00	0.93		0.00		2.29		-12.42		0.090420
3	20.00	6.58		0.00		9.17		-7.97		0.087114
4	20.00	-1.22		0.00		-0.55		-7.97		0.087114
*/

/*
localhost:8000/gels.html

Vehicle
Operational Weight (lbs)	Single Wheel Factor	Tire Pressure (psi)
170000.00
0.2309
170.00
Wheel Coordinates
Add Wheel  Delete Wheel

X (in)	Y (in)
0.00
0.00
-34.00
0.00
191.00
0.00
225.00
0.00
Output Coordinates
X (in)	Y (in)
0.00
0.00
Pavement
Add Layer  Delete Layer

Thickness (in)	Modulus of Elasticity (psi)
4.00
180000.00
8.00
3000000.00
8.00
30000.00
999.00
8000.00
Calculate Layer Stresses and Displacements due to Vehicle Multiple Wheel Loads

Results
Layer	z (in)	Sxx (psi)	Sxy (psi)	Syy (psi)	Szz (psi)	Wz (in)
1	0.00	-105.10	0.00	-120.91	-170.84	0.093441
1	4.00	-78.61	0.00	-86.80	-164.12	0.090658
2	4.00	-450.66	0.00	-598.90	-164.12	0.090658
2	12.00	468.80	0.00	624.64	-12.42	0.090420
3	12.00	0.93	0.00	2.29	-12.42	0.090420
3	20.00	6.58	0.00	9.17	-7.97	0.087114
4	20.00	-1.22	0.00	-0.55	-7.97	0.087114

*/

/* emi_gels python3 script from memory variable
read -r -d '' PY << EOM
from daygels import print_gels, poisson
vehicle =[170000.0, 0.2309, 170.0]
wheels = [[0.0, -34.0, 191.0, 225.0],  [0.0, 0.0, 0.0, 0.0]]
output = [0.0, 0.0]
pavement = [[4.0, 8.0, 8.0, 999.0], [180000.0, 3000000.0, 30000.0, 8000.0]]
pavement.append([poisson(ev) for ev in pavement[1]])
print_gels((vehicle, wheels, output, pavement))
EOM

python3 -c "$PY"
Vehicle	Wheels	Output	Pavement
[170000.0, 0.2309, 170.0] 	[[0.0, -34.0, 191.0, 225.0], [0.0, 0.0, 0.0, 0.0]] 	[0.0, 0.0] 	[[4.0, 8.0, 8.0, 999.0], [180000.0, 3000000.0, 30000.0, 8000.0], [0.2295781995917356, 0.13183029962242698, 0.29183029962242707, 0.33775280104064453]] 	
n	z1	z2	sxx	sxy	syy	szz	srz	wz	ur
[1, 0.0, 4.0, -104.7620544773214, 0.0, -120.65590679568805, -170.0712246789085, 6.174120851148168e-15, 0.09342364868258951, -0.0037392480599769797]
[1, 4.0, 4.0, -78.33782775471842, 0.0, -86.56248796947979, -163.37129385292215, -2.8087865947776063, 0.09065448416826388, -0.0019483307580617818]
[2, 4.0, 12.0, -449.7702900204804, 0.0, -598.6863554779626, -163.3712938529221, -2.808786594777553, 0.09065448416826384, -0.001948330758061779]
[2, 12.0, 12.0, 467.7024928179002, 0.0, 624.4940788164655, -12.404764167431537, -2.0437264864210967, 0.0904173461029407, 0.0017522003941991748]
[3, 12.0, 20.0, 0.9191485852777284, 0.0, 2.292869791622702, -12.404764167431429, -2.0437264864210665, 0.09041734610294067, 0.0017522003941991759]
[3, 20.0, 20.0, 6.571738606907936, 0.0, 9.165809064201028, -7.972474233516233, -1.1940452911197856, 0.08711287925183434, 0.004231298786018497]
[4, 20.0, 1019.0, -1.2193454645706652, 0.0, -0.5513398732078402, -7.972474233516235, -1.1940452911197863, 0.08711287925183434, 0.004231298786018497]

*/