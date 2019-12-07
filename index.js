const { promisify } = require('util'),
  exec = promisify(require('child_process').exec),
  cluster = require('cluster');

// todo: cli args handler
const ports = [22, 23, 80, 443],
  pingArgs = ['ping', '-c1', '-w1'],
  ipRange = {
    ipStart: '100.87.0.1',
    ipEnd: '100.87.1.0'
  };
let promises = [];

// ping arg flags os dependent
// up the timeout for high latency but reachable hosts
async function ping(pingArgs, ip) {
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

const pingEnumerated = ((pingArgs, ipStart, ipEnd, promiseArray) => {
  // todo: fix prone to overflow if ipEnd invalid
  // todo: ipEnd be inclusive
  // scan in series not parallel to avoid "fork bomb" slowdowns?
  for (let ip = ipStart; ip !== ipEnd; ip = increment(ip)) {
    process.stdout.write(ip);
    promiseArray.push(ping(pingArgs, ip));
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  };
  process.stdout.write("\n");

  return promiseArray;
});
promises = pingEnumerated(pingArgs, ipRange['ipStart'], ipRange['ipEnd'], promises);

(function(promiseArray) {
  Promise.allSettled(promiseArray)
    .then((promiseArray) => {
      promiseArray.forEach((promise) => { // console.log(results) omits due to limited buffer size(?)
        if (value = promise['value']) { // todo: less implicit conditional for resolved only
          console.log(value);
          // todo: spawn worker threads for every cpu core to scan tcp/udp ports of reachable hosts
          // todo: traceroute port scan hops
        }
      });
    });
}) (promises);
