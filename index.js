const { spawn } = require('child_process');
// todo cli argument handler
let ipOctets = '100.87.0.1'.split('.');
const ports = [22, 23, 80, 443];

let i = 3; // todo elegantly terminate enumeration; dont scan 255.255.255.0, 255.255.0.0, ...
while (i in ipOctets) {
  var ping = spawn('ping', ['-c1', '-w1', ipOctets.join('.')], { // flags platform dependent
    stdio: 'inherit'
  });

  ipOctets[i]++;
  if (255 < ipOctets[i]) {
    ipOctets[i] = 0;
    i--;
    continue;
  }
  i = 3;
}
