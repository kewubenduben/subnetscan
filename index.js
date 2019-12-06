const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

async function ping(ip) {
  let { stdout } = await exec(`ping -c1 -w1 ${ip}`) // ping arg flags os dependent
    .catch(() => {});
  return stdout;
};

function increment(ip) {
  let ipOctets = ip.split('.')
  for (let i = ipOctets.length - 1; i in ipOctets; i--) {
    ipOctets[i]++
    if (ipOctets[i] > 255)
      ipOctets[i] = 0
    else
      break
  }
  return ipOctets.join('.')
}

// todo: cli argument handler
const ipStart = '100.87.0.1';
const ipEnd = '100.87.0.3';
const ports = [22, 23, 80, 443];

let ip = ipStart;
let promises = [];
while(ip !== ipEnd) { // todo: fix prone to overflow if ipEnd supplied with invalid ip address
  promises.push(ping(ip));
  ip = increment(ip);
};

Promise.allSettled(promises)
  .then((results) => {
    results.forEach((result) => {
      console.log(result)
      // todo: spawn worker threads for every cpu core to scan tcp/udp ports of reachable host
    })
  });
