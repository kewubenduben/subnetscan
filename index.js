const { spawn } = require('child_process');

let ipOctets = '100.87.0.1'.split('.');
const ports = [22, 23, 80, 443];

const ping = spawn('ping', ['-c1', '-w1', ipOctets.join('.')])
  .on('exit', (code) => {
    console.log(code);
  });

// let i = 3; // todo ipv4 enumeration doesnt terminate elegantly (i.e., scans 255.255.255.0, 255.255.0.0, ...)
// while (i in ipOctets) {
//   console.log(ipOctets);
//
//   ipOctets[i]++;
//   if (255 < ipOctets[i]) {
//     ipOctets[i] = 0;
//     i--;
//     continue;
//   }
//   i = 3;
// }
