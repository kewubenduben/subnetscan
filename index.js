const { promisify } = require('util'),
  exec = promisify(require('child_process').exec),
  cluster = require('cluster');

// todo?: up the timeout for high latency but reachable hosts
// ping arg flags os dependent
async function ping(_pingArgs, _ip) {
  let { error, stdout, stderr } = await exec(`${_pingArgs.join(' ')} ${_ip}`);
  return (stdout ? [_ip, stdout] : [error, stderr]);
};

// 255.255.255.255 increments to 0.0.0.0
function increment(_ip) {
  let ipOctets = _ip.split('.');
  for (let i = ipOctets.length - 1; i in ipOctets; i--) {
    ipOctets[i]++;
    if (ipOctets[i] > 255)
      ipOctets[i] = 0;
    else
      break;
  }
  return ipOctets.join('.');
}

function pingEnumerated(_pingArgs, _ipRange) {
  // todo!: fix prone to overflow if ipEnd invalid
  // todo: ipEnd be inclusive
  // todo?: scan in series not parallel to avoid "fork bomb" slowdowns
  let promises = [];
  for (let ip = _ipRange['start']; ip !== _ipRange['end']; ip = increment(ip)) {
    process.stdout.write(ip);
    promises.push(ping(_pingArgs, ip));
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  };
  process.stdout.write("\n");

  return promises;
};

// todo!: spawn worker threads for every cpu core to scan tcp/udp ports of reachable hosts
// todo: less implicit conditional for resolved only
// todo: cli args handler
// todo?: port scan traceroute hops
// console.log(results) omits due to limited buffer size(?)
const ports = [22, 23, 80, 443],
  iprange = {
    start: '100.87.0.1',
    end: '100.87.1.0'
  },
  pingargs = ['ping', '-c1', '-w1'],
  promises = pingEnumerated(pingargs, iprange);
(function(_promises) {
  Promise.allSettled(_promises)
    .then((_promises) => {
      _promises.forEach((promise) => {
        if (value = promise['value']) {
          console.log(value);
        }
      });
    });
}) (promises);
