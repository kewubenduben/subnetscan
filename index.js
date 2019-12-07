const { promisify } = require('util'),
  exec = promisify(require('child_process').exec),
  cluster = require('cluster');

// todo?: up the timeout for high latency but reachable hosts
// ping arg flags os dependent
async function ping(argArray, ip) {
  let { error, stdout, stderr } = await exec(`${pingArgs.join(' ')} ${ip}`);
  return (stdout ? [ip, stdout] : [error, stderr]);
};

// 255.255.255.255 increments to 0.0.0.0
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

function pingEnumerated((pingArgs, ipStart, ipEnd, pingPromises) => {
  // todo!: fix prone to overflow if ipEnd invalid
  // todo: ipEnd be inclusive
  // todo?: scan in series not parallel to avoid "fork bomb" slowdowns
  for (let ip = ipStart; ip !== ipEnd; ip = increment(ip)) {
    process.stdout.write(ip);
    pingPromises.push(ping(pingArgs, ip));
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  };
  process.stdout.write("\n");

  return promiseArray;
});

// todo!: spawn worker threads for every cpu core to scan tcp/udp ports of reachable hosts
// todo: less implicit conditional for resolved only
// todo: cli args handler
// todo?: port scan traceroute hops
// console.log(results) omits due to limited buffer size(?)
const ports = [22, 23, 80, 443],
  ipRange = {
    ipStart: '100.87.0.1',
    ipEnd: '100.87.1.0'
  },
  pingArgs = ['ping', '-c1', '-w1'];
let pingPromises = [];
promises = pingEnumerated(pingArgs, ipRange['ipStart'], ipRange['ipEnd'], promises);
(function(promiseArray) {
  Promise.allSettled(promiseArray)
    .then((promiseArray) => {
      promiseArray.forEach((promise) => {
        if (value = promise['value']) {
          console.log(value);
        }
      });
    });
}) (promises);
