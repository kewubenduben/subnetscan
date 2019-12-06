const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
// todo: cli argument handler
let ip = '100.87.0.1';
const ports = [22, 23, 80, 443];

async function ping(ip) {
  await exec(`ping -c1 -w1 ${ip}`) // flags os dependent
    .then(stdout => console.log(stdout)) // todo: only pipe stdout to tty if ping closes with exit_code 0
    .catch(stderr => console.error(stderr))
};

function increment(ip) {
  let ipOctets = ip.split('.');
  for (let i = ipOctets.length - 1; 0 < i; i--)
    if (ipOctets[i] <= 255) {
      ipOctets[i]++;
      break;
    } else
      ipOctets[i] = 0;

  return ipOctets.join('.');
}

const enumeratePing = async _ => { // todo: use an async-await friendly loop
  while (ip !== '255.255.255.255') {
    await ping(ip);
    // todo: spawn worker threads with require('cluster') for every cpu core to scan tcp/udp ports of reachable host with require('net').Socket
    ip = increment(ip);
  }
}
enumeratePing();
