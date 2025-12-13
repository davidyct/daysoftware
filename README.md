# localhost web site

# start web server serving static pages
cd daysoftware
python3 -m http.server

# open web browser at page localhost:8000/

# compare to node js script, results for both are saved in test_gels.js
node test_gels.js


# emi_gels (python3)
mkdir emi_gels
cd emi_gels
cp ../resources/bessel.txt ./bessel.py
cp ../resources/daygels.txt ./daygels.py
cp ../resources/layer.txt ./layer.py
cp ../daygels_example.txt ./daygels_example.py

python3 -m daygels_example


# Operational Weight - lbs, Single Wheel Factor, Tire Pressure - psi
# vehicle =[170000.0, 0.2309, 170.0]
# Wheel X Coordinates - in, Wheel Y Coordinates - in
# wheels = [[0.0, -34.0, 191.0, 225.0],  [0.0, 0.0, 0.0, 0.0]]
# Result Output X Coordinate - in, Result Output Y Coordinate - in
# output = [0.0, 0.0]
# Layer Thickness - in, Layer Modulus of Elasticity - psi, Poisson's Ratio default
# pavement = [[4.0, 8.0, 8.0, 999.0], [180000.0, 3000000.0, 30000.0, 8000.0]]
# pavement.append([poisson(ev) for ev in pavement[1]])

# emi_gels python3 script from memory variable, results saved in test_gels.js

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