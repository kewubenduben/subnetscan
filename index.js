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
(function(ipStart, ipEnd) {
  let promises = [];
  for (let ip = ipStart; ip !== ipEnd; ip = increment(ip))
    promises.push(ping(ip));

  Promise.allSettled(promises)
    .then((results) => {
      results.forEach((result) => {
        console.log(result); // todo: only stdout ping results with exit_code 0, i.e. resolved promises
        // todo: spawn worker threads for every cpu core to scan tcp/udp ports of reachable host
      });
    });
}) (ipStart, ipEnd);
