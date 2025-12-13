/* MIT License
Copyright 2020 David Yang
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
    function calchz(h, n) {
      var hz = 0.0;
      for (var i=1; i <= n; i++) {
        hz += h[i];
      }
      return hz;
    }
    function poisson(e) {
      return 0.65 - 0.08 * Math.log(e) / Math.log(10.0);
    }
    function calcc1(e, u) {
      return e / (1.0 + u);
    }
    function calcc3(u) {
      return 4.0 * u;
    }
    function calcp2hz(p,hz) {
      return (p + p) * hz;
    }
    function calcbeta(hz,c1,c3,p,n) {
      var beta = new Array();
      var p2hz = calcp2hz(p,hz[n]);
      beta[0] = 0.0;
      beta[1] = c1[n] / c1[n+1];
      beta[2] = beta[1] - c3[n] + 3.0;
      beta[3] = p2hz - c3[n+1] + 1.0;
      beta[4] = p2hz + c3[n+1] - 1.0;
      beta[5] = c3[n] - p2hz - 1.0;
      beta[6] = beta[1] * (3.0 - c3[n+1]) + 1.0;
      beta[7] = c3[n] + p2hz - 1.0;
      beta[8] = (beta[4] * beta[2] - beta[7] * beta[6]) / 2.0;
      beta[9] = (beta[3] * beta[2] + beta[5] * beta[6]) / 2.0;
      beta[10] = ( (beta[6] - (4.0 - c3[n])) + beta[7] * (beta[1] - 1.0) * beta[3]) / 2.0;
      beta[11] = (-(beta[6] - (4.0 - c3[n])) + beta[5] * (beta[1] - 1.0) * beta[4]) / 2.0;
      return beta; 
    }
    function radius(swgt, psi) {
      return Math.sqrt(swgt / (Math.PI * psi));
    }
    function getrr(wheels, output) {
      var xr = [];
      var yr = [];
      var rr = [];
      xr[0] = 0.0;
      yr[0] = 0.0;
      rr[0] = 0.0;
      for (var i = 1; i < wheels[1].length; i++) {
        xr[i] = output[1] - wheels[1][i];
        yr[i] = output[2] - wheels[2][i];
        rr[i] = Math.sqrt(xr[i] * xr[i] + yr[i] * yr[i]);
        if (rr[i] > 0.0) {
          xr[i] = xr[i] / rr[i];
          yr[i] = yr[i] / rr[i];
        } else {
          xr[i] = 1.0;
          yr[i] = 0.0;
        }
          
      }
      return [0.0, xr, yr, rr];
    }
    function main(vehicle, wheels, output, pavement) {
    /* 1 layer wzero=0.39864959 for 200.0 psi, 9.0 in radius
      var th = new Array(0.0, 999.0);
      var ev = new Array(0.0, 8000.0);
      var ps = new Array(0.0, poisson(ev[1]));
      var hz = new Array(0.0, calchz(th, 1));
      var zz = new Array(0.0, hz[0]);
      var lz = new Array(0  , 1);
      var ac1 = new Array(0.0, calcc1(ev[1], ps[1]));
      var ac3 = new Array(0.0, calcc3(ps[1]));
    */
    /* 2 layer wzero=0.25719360 for 200.0 psi, 9.0 radius
      var th = new Array(0.0, 8.0, 999.0);
      var ev = new Array(0.0, 30000.0, 8000.0);
      var ps = new Array(0.0, poisson(ev[1]), poisson(ev[2]));
      var hz = new Array(0.0, calchz(th, 1), calchz(th, 2));
      var zz = new Array(0.0, hz[0], hz[1], hz[1]);
      var lz = new Array(0  , 1    , 1    , 2);
      var ac1 = new Array(0.0, calcc1(ev[1], ps[1]), calcc1(ev[2],ps[2]));
      var ac3 = new Array(0.0, calcc3(ps[1]), calcc3(ps[2]));
    */
    /* 3 layer wzero=0.04325943 for 200.0 psi, 9.0 radius/ Fortran Gels NDT3 0.043252
               stress12=396.45682566                     / 396.456
      var th = new Array(0.0, 12.0, 8.0, 999.0);
      var ev = new Array(0.0, 3000000.0, 30000.0, 8000.0);
      var ps = new Array(0.0, poisson(ev[1]), poisson(ev[2]), poisson(ev[3]));
      var hz = new Array(0.0, calchz(th, 1), calchz(th, 2), calchz(th, 3));
      var zz = new Array(0.0, hz[0], hz[1], hz[1], hz[2], hz[2]);
      var lz = new Array(0  , 1    , 1    , 2    , 2    , 3);
      var ac1 = new Array(0.0, calcc1(ev[1], ps[1]), calcc1(ev[2],ps[2]), calcc1(ev[3],ps[3]));
      var ac3 = new Array(0.0, calcc3(ps[1]), calcc3(ps[2]), calcc3(ps[3]));
    */
    /* 4 layer wzero=0.06064239 for 200.0 psi, 9.0 radius/ Fortran Gels NDT3 0.060522
               stress12=613.97078550                     / 613.978
       4 layer wzero=0.09344135 for 170.0 psi, 170000.0 opwgt, .2309 wgt/ Fortran Gels PFLN 0.093435
               stress12=624.63548532                     / 624.513
      var th = new Array(0.0, 4.0, 8.0, 8.0, 999.0);
      var ev = new Array(0.0, 180000.0, 3000000.0, 30000.0, 8000.0);
      var ps = new Array(0.0, poisson(ev[1]), poisson(ev[2]), poisson(ev[3]), poisson(ev[4]));
      var hz = new Array(0.0, calchz(th, 1), calchz(th, 2), calchz(th, 3), calchz(th, 4));
      var zz = new Array(0.0, hz[0], hz[1], hz[1], hz[2], hz[2], hz[3], hz[3]);
      var lz = new Array(0  , 1    , 1    , 2    , 2    , 3    ,3     ,4);
      var ac1 = new Array(0.0, calcc1(ev[1], ps[1]), calcc1(ev[2], ps[2]), calcc1(ev[3] ,ps[3]), calcc1(ev[4], ps[4]));
      var ac3 = new Array(0.0, calcc3(ps[1]), calcc3(ps[2]), calcc3(ps[3]), calcc3(ps[4]));
    */
    /*
      var wgt = 1.0
      var psi = 200.0;
      var opwgt = Math.PI * 9.0 * 9.0 * psi;
      var vehicle = new Array(0.0, radius(opwgt * wgt, psi), opwgt, wgt, psi);
      //alert(vehicle[1].toFixed(8));
      var wheels = new Array(new Array(0.0, 0.0), new Array(0.0, 0.0), new Array(0.0, 0.0));
    */
    /*
      var wgt = 0.2309
      var psi = 170.0;
      var opwgt = 170000.0;
      var vehicle = new Array(0.0, radius(opwgt * wgt, psi), opwgt, wgt, psi);
      //alert(vehicle[1].toFixed(8));
      var wheels = new Array(new Array(0.0, 0.0, 0.0, 0.0, 0.0), new Array(0.0, 0.0, -34.0, 191.0, 225.0), new Array(0.0, 0.0, 0.0, 0.0, 0.0));
    
      var output = new Array(0.0, 0.0, 0.0);
    */
      //var vehicle = getvehicle();
      //populateDebug(vehicle,"01");
      //var wheels = getwheels();
      //populateDebug(wheels[1],"02");
      //populateDebug(wheels[2],"03");
      //var output = getoutput();
      //populateDebug(output,"04");
      //var pavement = getpavement();
      
      var rr = getrr(wheels, output);
    
      var th = pavement[1];
      var ev = pavement[2];
    
      var ps = [];
      var hz = [];
      var zz = [];
      var lz = [];
      var ac1 = [];
      var ac3 = [];
    
      ps[0] = 0.0;
      hz[0] = 0.0;
      zz[0] = 0.0;
      lz[0] = 0;
      ac1[0] = 0.0;
      ac3[0] = 0.0;
    
      zz[1] = hz[0];
    
      for (var i = 1; i < ev.length; i++) {
        ps[i] = poisson(ev[i]);
        hz[i] = calchz(th,i);
        ac1[i] = calcc1(ev[i],ps[i]);
        ac3[i] = calcc3(ps[i]);
        if (i*2 < (ev.length - 1) * 2) {
          zz[i*2] = hz[i];
          zz[i*2 + 1] = hz[i];
        }
        lz[i*2 - 1] = i;
        if (i*2 < (ev.length - 1) * 2 ) {
          lz[i*2] = i;
        }
      }
      //populateDebug(th,"05");
      //populateDebug(ev,"06");
      //populateDebug(ps,"07");
      //populateDebug(hz,"08");
      //populateDebug(zz,"09");
      //populateDebug(lz,"10");
    
      var ee = [];
      var xg = [0.0, -0.86113631, -0.33998104, 0.33998104, 0.86113631];
      var wg = [0.0, 0.34785485 ,  0.65214515, 0.65214515, 0.34785485];
      var ts = [];
      var bs = [];
      var as = [];
      for (var iis = 0; iis < 8; iis++) {
        var tsr = [];
        for (var iz = 0; iz < zz.length; iz++) {
          tsr[iz] = 0.0;
        }
        ts[iis] = tsr;
      }
    
      for (var i = 1; i < rr[3].length; i++) {
        for (var iz = 0; iz < zz.length; iz++) {
          as[iz] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
          bs[iz] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
        }
        var bx = zs[1];
        var js = 2;
        var ks = 2;
        var ls = 3;
        var ms = 0;
        while(1==1) {
          var ax = bx;
          if (zs[js] * vehicle[1] == zs[ks] * rr[3][i]) {
            bx = zs[ks];
            ks = ks + 1;
            js = js + 1;
          } else {
            if (zs[js] * vehicle[1] > zs[ks] * rr[3][i]) {
              bx = zs[ks];
              ks = ks + 1;
            } else {
              bx = zs[js] * vehicle[1] / rr[3][i];
              js = js + 1;
            }
          }
          var dx = (bx - ax) / 2.0;
          var ex = dx + ax;
          for (var ip = 1; ip < 5; ip++) {
            var pa = dx * xg[ip] + ex;
            var p = pa / vehicle[1];
            var x = 0.0;
            var j1 = bes1(pa);
            var j2 = 1.0;
            var j3 = 0.5;
            if (rr[3][i] > 0.0) {      
              x = p * rr[3][i];
              j2 = besz(x);
              j3 = bes1(x)/x;
            }
            var dd = [];
            dd[0] = [[0.0, 0.0, 0.0, 0.0, 0.0],
                     [0.0, 0.0, 0.0, 0.0, 0.0], 
                     [0.0, 0.0, 0.0, 0.0, 0.0], 
                     [0.0, 0.0, 0.0, 0.0, 0.0], 
                     [0.0, 0.0, 0.0, 0.0, 0.0]];
            for (var j = 1; j < th.length-1; j++) {
              var beta = calcbeta(hz,ac1,ac3,p,j);
              dd[j] = [[0.0, 0.0, 0.0, 0.0, 0.0],
                       [0.0, beta[2], beta[7] * (beta[1] - 1.0), beta[8], beta[10]], 
                       [0.0, beta[5] * (beta[1] - 1.0), beta[2], beta[11], beta[9]],
                       [0.0, 0.0, (1.0 - beta[1]) + (1.0 - beta[1]), beta[6], -beta[3] * (beta[1] -1.0)],
                       [0.0, (beta[1] - 1.0) + (beta[1] - 1.0), 0.0, beta[4] * (beta[1] - 1.0), beta[6]]];
            }
            var bb = calcgg(0.0, 0.0, 0.0, 1.0, dd, th, ps, p);
            var gg = calcgg(0.0, 1.0, 0.0, 0.0, dd, th, ps, p);
            var c3 = Math.exp(-calcp2hz(p,hz[1]));
            var c1 = (gg[1][3] * bb[1][1] - gg[1][1] * bb[1][3]) * c3;
            var c4 = (gg[1][1] * bb[1][4] - gg[1][4] * bb[1][1] + gg[1][2] * bb[1][3] - gg[1][3] * bb[1][2]) * (4.0 * ps[1] - 1.0);
            var c5 = (gg[1][3] * bb[1][4] - gg[1][4] * bb[1][3]) * 4.0 * ps[1] * (ps[1] + ps[1] - 1.0);
            c1 = (c1 + (gg[1][2] * bb[1][1] - gg[1][1] * bb[1][2]) * 2.0 + c4 + c5) * c3;
            c1 = c1 + gg[1][4] * bb[1][2] - gg[1][2] * bb[1][4];
            var gg2 =  ((bb[1][1] + (ps[1] + ps[1]) * bb[1][3]) * c3 + bb[1][2] - (ps[1] + ps[1]) * bb[1][4]) / c1;
            var gg4 = -((gg[1][1] + (ps[1] + ps[1]) * gg[1][3]) * c3 + gg[1][2] - (ps[1] + ps[1]) * gg[1][4]) / c1;
            var hh = calcgg(0.0, gg2, 0.0, gg4, dd, th, ps, p);
            //console.log(p);
            //console.log(hh);
            for (var iz = 1; iz < zz.length; iz++) {
              var n = lz[iz];
              var pz = p * zz[iz];
              var ez = 0.0;
              if (pz <= 88) ez = Math.exp(-pz);
              var eh = Math.exp(-(p + p) * (hz[n] - zz[iz]));
              //if (iz===1) console.log(hh[n][1] / ez * p * p * p);
              c1 = dx * wg[ip] * j1 * ez;
              var c2 = c1 * j3;
              c1 = c1 * j2;
              c3 = ps[n] + ps[n];
              c4 = (hh[n][1] + (1 + pz) * hh[n][3]) * eh - hh[n][2] + (1 - pz) * hh[n][4];
              c5 = c1 * c3 * (hh[n][3] * eh + hh[n][4]);
              bs[iz][1] = bs[iz][1] + (c1 - c2) * c4 + c5;
              bs[iz][2] = bs[iz][2] + c2 * c4 + c5;
              var c6 = (-hh[n][1] + (1 - c3 - pz) * hh[n][3]) * eh + hh[n][2] + (1 - c3 + pz) * hh[n][4];
              bs[iz][3] = bs[iz][3] + c1 * c6;
              c6 = (-hh[n][1] + (2 - c3 - c3 - pz) * hh[n][3]) * eh - hh[n][2];
              bs[iz][5] = bs[iz][5] + c1 * (c6 + (-2 + c3 + c3 - pz) * hh[n][4]) / p;
            }
          }
          if (ks - 1 == ls || js - 1 == ls) {
            ms = ms + 1;
            ee[ms] = bs[1][5] / (ts[7][1] + as[1][5] + bs[1][5]);
            //alert('wz = ' + bs[1][5].toFixed(8));
            //alert('sz = ' + bs[1][3].toFixed(8));
            for (var iz = 1; iz < zz.length; iz++) {
              for (var iis = 1; iis < 8; iis++) {
                as[iz][iis]  = as[iz][iis] + bs[iz][iis];
                bs[iz][iis] = 0.0;
              }
            }
            if (Math.abs(ee[ms]) < .00002 || ls == 35) break;
            ls = ls + 4;
          }
        }
        for (var iz = 1; iz < zz.length; iz++) {
          ts[1][iz] = ts[1][iz] + as[iz][1] * rr[1][i] * rr[1][i] + as[iz][2] * rr[2][i] * rr[2][i];
          ts[2][iz] = ts[2][iz] + as[iz][1] * rr[1][i] * rr[2][i] - as[iz][2] * rr[1][i] * rr[2][i];
          ts[4][iz] = ts[4][iz] + as[iz][1] * rr[2][i] * rr[2][i] + as[iz][2] * rr[1][i] * rr[1][i];
          ts[6][iz] = ts[6][iz] + as[iz][3];
          ts[7][iz] = ts[7][iz] + as[iz][5];
        }
      }
      for (var iz = 1; iz < zz.length; iz++) {
        for (var iis = 1; iis < 8; iis++) {
          ts[iis][iz] = -vehicle[4] * ts[iis][iz];
        }
        ts[7][iz] = ts[7][iz] * (1.0 + ps[lz[iz]]) / ev[lz[iz]];
        //alert(ts[7][iz].toFixed(8));
      }
      //populateTable(ts,zz);
      return [ts, zz];
    }
    
    function calcgg(g1,g2,g3,g4,dd,th,ps,p) {
      var gg = [];
      gg[0] = [0.0, 0.0, 0.0, 0.0, 0.0];
      if (th.length - 1 < 2 ) {
        gg[th.length - 1] = new Array(0.0, g1, g2, g3, g4);
        return gg;
      }
      if (th.length - 1 < 3) {
        var n = th.length - 2;
        gg[n] = [0.0,
                 (dd[n][1][2] * g2 + dd[n][1][4] * g4) / ((1.0 - ps[n]) * 4.0),
                 (dd[n][2][2] * g2 + dd[n][2][4] * g4) / ((1.0 - ps[n]) * 4.0),
                 (dd[n][3][2] * g2 + dd[n][3][4] * g4) / ((1.0 - ps[n]) * 4.0),
                 (dd[n][4][2] * g2 + dd[n][4][4] * g4) / ((1.0 - ps[n]) * 4.0)]
        gg[th.length - 1] = [0.0, g1, g2, g3, g4];
        return gg;
      }
      for (var n = 1; n < th.length - 1; n++) {
        gg[n] = [0.0, 0.0, 0.0, 0.0, 0.0];
      }
      gg[th.length - 1] = [0.0, g1, g2, g3, g4];
      for (var n = th.length - 2; n > 0; n--) {
        ac = [];
        ac[0] = 0.0;
        for (var j = 1; j < 5; j++) {
          var c1 = (p + p) * th[n+1];
          var c2 = dd[n][j][1] * gg[n+1][1] + dd[n][j][3] * gg[n+1][3];
          var c3 = Math.log(Math.abs(c2)) - c1;
          if (Math.abs(c3) <= 88) {
            c2 = (c2 < 0.0 ? -1.0 : 1.0) * Math.exp(c3);
          } else {
            c2 = 0.0;
          }
          ac[j] = c2;
        }
        gg[n] = [ 0.0,
                 (ac[1] + (dd[n][1][2] * gg[n+1][2] + dd[n][1][4] * gg[n+1][4])) / ((1.0 - ps[n]) * 4.0),
                 (ac[2] + (dd[n][2][2] * gg[n+1][2] + dd[n][2][4] * gg[n+1][4])) / ((1.0 - ps[n]) * 4.0),
                 (ac[3] + (dd[n][3][2] * gg[n+1][2] + dd[n][3][4] * gg[n+1][4])) / ((1.0 - ps[n]) * 4.0),
                 (ac[4] + (dd[n][4][2] * gg[n+1][2] + dd[n][4][4] * gg[n+1][4])) / ((1.0 - ps[n]) * 4.0)];
      }
      return gg;
    }
    
    var zs = [0.0 
      ,  0.0,      1.0,      2.4048256,3.831706, 5.5200781,7.0155867,8.6537279 
      , 10.173468,11.791534,13.323692,14.930918,16.470630,18.071064,19.615859 
      , 21.211637,22.760084,24.352472,25.903672,27.493479,29.046829,30.634606 
      , 32.18968, 33.775820,35.332308,36.917098,38.474766,40.058426,41.617094 
      , 43.199792,44.759319,46.341188,47.901461,49.48261, 51.043535,52.624052 
      , 54.185554,55.765551,57.327525,58.906984,60.469458,62.048469,63.611357 
      , 65.189965,66.753227,68.331469,69.895072,71.472982,73.036895,74.614501 
      , 76.1787,  77.756026,79.320487,80.897556,82.46226, 84.039091,85.604019 
      , 87.18063, 88.745767,90.322173,91.887504,93.463719,95.029232,96.605268 
      , 98.170951,99.74682,101.31266,102.88837,104.45437,106.02993,107.59606 
      ,109.17149,110.73775];
    var a07 = [0.0, 1.0,       -2.2499997,  1.2656208, -0.3163866,  0.0444479, -0.0039444,  0.00021];
    var a14 = [0.0, 0.79788456,-0.00000077,-0.0055274, -0.00009512, 0.00137237,-0.00072805, 0.00014476];
    var a21 = [0.0,-0.78539816,-0.04166397,-0.00003954, 0.00262573,-0.00054125,-0.00029333, 0.00013558];
    var a28 = [0.0, 0.5,       -0.56249985, 0.21093573,-0.03954289, 0.00443319,-0.00031761, 0.00001109];
    var a35 = [0.0, 0.79788456, 0.00000156, 0.01659667, 0.00017105,-0.00249511, 0.00113653,-0.00020033];
    var a42 = [0.0,-2.35619449, 0.12499612, 0.0000565, -0.00637879, 0.00074348, 0.00079824,-0.00029166];
    function polyx(a, x) {
      var y = a[a.length - 1];
      for (var i=a.length - 2; i > 0; i--) {
        y = y * x + a[i];
      }
      return y;
    }
    function bes1(x) {
      if (x <= 3.0) {
        var x3 = x / 3.0;
        return polyx(a28, x3 * x3) * x;
      } else {
        var x3 = 3.0 / x;
        return polyx(a35, x3) / Math.sqrt(x) * Math.cos(x + polyx(a42, x3));
      }
    }
    function besz(x) {
      if (x <= 3.0) {
        var x3 = x / 3.0;
        return polyx(a07, x3 * x3); 
      } else {
        var x3 = 3.0 / x;
        return polyx(a14, x3) / Math.sqrt(x) * Math.cos(x + polyx(a21, x3));
      }
    }

(function (exports) {
    exports.gels = main;
})(typeof exports === 'undefined' ? this['daygels'] = {} : exports);