const { promisify } = require('util'),
  exec = promisify(require('child_process').exec);

// ping arg flags os dependent
// up the timeout for high latency but reachable hosts
async function ping(ip) {
  let { error, stdout, stderr } = await exec(`ping -c1 -w1 ${ip}`);
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
  ipEnd = '100.87.1.0',
  ports = [22, 23, 80, 443];
(function(ipStart, ipEnd) {
  let promises = [];

  // todo: fix prone to overflow if ipEnd invalid
  // todo: ipEnd be inclusive
  for (let ip = ipStart; ip !== ipEnd; ip = increment(ip)) {
    process.stdout.write(ip);
    promises.push(ping(ip));
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  } // scan in series not parallel to avoid "fork bomb" slowdowns on an i7?
  process.stdout.write("\n");

  Promise.allSettled(promises)
    .then((results) => {
      results.forEach((result) => { // console.log(results) omits due to limited buffer size(?)
        if (value = result['value']) {
          console.log(value);
          // todo: spawn worker threads for every cpu core to scan tcp/udp ports of reachable hosts
        }
      });
    });
}) (ipStart, ipEnd);
