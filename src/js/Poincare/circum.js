function add(a, b) {
  return [a[0] + b[0], a[1] + b[1]]
}

function sub(a, b) {
  return [a[0] - b[0], a[1] - b[1]]
}

function con(a) {
  return [a[0], -a[1]]
}

function mog(a) {
  return sq(a[0]) + sq(a[1])
}

function arg(a) {
  let mult = 0;
  if (a[0] < 0) {
    mult = 1;
  }
  return Math.atan(a[1] / a[0]) + mult * Math.PI
}

function mul(a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]
}

function div(a, b) {
  let ans = mul(a, con(b));
  return [ans[0] / mog(b), ans[1] / mog(b)]
}

function nor(a) {
  return [a[0] / sqrt(mog(a)), a[1] / sqrt(mog(a))]
}

function car(a) {
  return [a[0] * Math.cos(a[1]), a[0] * Math.sin(a[1])]
}

function pol(a) {
  return [sqrt(mog(a)), arg(a)];
}


function minor(a, i, j) {
  let ans = [];
  for (let n = 0; n < a.length; n++) {
    if (n == i) {
      continue;
    }
    ans.push([]);
    for (let m = 0; m < a.length; m++) {
      if (m == j) {
        continue;
      }
      ans[ans.length - 1].push(a[n][m]);
    }
  }
  return ans;
}
function sq(a) {return a * a;}

class Lin {
  updateStuff() {
    let cp = this.p;
    let cq = this.q;
    let invp = car([1 / mog(cp), arg(cp)]);
    let matrix = [
      [0, 0, 0, 0],
      [mog(cp), cp[0], cp[1], 1],
      [mog(cq), cq[0], cq[1], 1],
      [mog(invp), invp[0], invp[1], 1]
    ];
    let m11 = determinant(minor(matrix, 0, 0));
      this.isLine = false;
      this.o = [0.5 * determinant(minor(matrix, 0, 1)) / m11,
        -0.5 * determinant(minor(matrix, 0, 2)) / m11
      ];
      this.r = Math.sqrt(mog(this.o) + determinant(minor(matrix, 0, 3)) / m11);
      let alpha = arg(this.o);
      let ptheta = arg(this.p);
      let pphi = Math.asin(Math.sin(ptheta - alpha) *
        Math.sqrt(mog(this.p)) / Math.sqrt(mog(sub(this.p, this.o))));
      let qtheta = arg(this.q);
      let qphi = Math.asin(Math.sin(qtheta - alpha) *
        Math.sqrt(mog(this.q)) / Math.sqrt(mog(sub(this.q, this.o))));
      this.a = alpha;
      this.pp = -pphi;
      this.qp = -qphi;
  }
  constructor(pposx, pposy, qposx, qposy) {
    this.p = [pposx, pposy];
    this.q = [qposx, qposy];
    this.updateStuff();
  }

}

export function drawLine(p, q) {

    let l = new Lin(p[0], p[1], q[0], q[1]);
    console.log("A", l.o);
    return [l.o, l.r, l.pp, l.qp];

}



function determinant(a) {
  if (a.length == 2) {
    return a[0][0] * a[1][1] - a[0][1] * a[1][0];
  } else {
    let ans = 0;
    let cofactor = 1;
    for (let i = 0; i < a.length; i++) {
      ans += cofactor * a[0][i] * determinant(minor(a, 0, i));
      cofactor *= -1;
    }
    return ans;
  }
}


