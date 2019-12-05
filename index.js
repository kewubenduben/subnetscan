let ipOctets = '100.87.0.1'.split('.');
const ports = [22, 23, 80, 443];

let i = 3;
while (i in ipOctets) {
  console.log(ipOctets);

  ipOctets[i]++;
  if (255 < ip[i]) {
    ipOctets[i] = 0;
    i--;
    continue;
  }
  i = 3;
}
