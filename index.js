const { promisify } = require('util'),
  exec = promisify(require('child_process').exec);

async function ping(ip) {
  let { error, stdout, stderr } = await exec(`ping -c1 -w1 ${ip}`); // ping arg flags os dependent
  return stdout || stderr;
};

function increment(ip) {
  let ipOctets = ip.split('.');
  for (let i = ipOctets.length - 1; i in ipOctets; i--) {
    ipOctets[i]++;
    if (ipOctets[i] > 255)
      ipOctets[i] = 0;
    else
      break;
  }
  return ipOctets.join('.');
}

// todo: cli argument handler
const ipStart = '100.87.0.1',
  ipEnd = '100.87.0.3',
  ports = [22, 23, 80, 443];
(function(ipStart, ipEnd) {
  let promises = [];
  for (let ip = ipStart; ip !== ipEnd; ip = increment(ip)) // todo: fix prone to overflow if ipEnd invalid
    promises.push(ping(ip));

  Promise.allSettled(promises)
    .then((results) => {
      results.forEach((result) => { // console.log(results) omits due to limited buffer size(?)
        if (value = result['value']) {
          console.log(value);
        }
        // todo: spawn worker threads for every cpu core to scan tcp/udp ports of reachable hosts
      });
    });
}) (ipStart, ipEnd);
