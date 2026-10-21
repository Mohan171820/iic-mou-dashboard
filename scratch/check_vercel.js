const https = require('https');
https.get('https://iic-mou-dashboard.vercel.app/chairperson', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('Includes Industry-Academia Connect title:', d.includes('<div class="hdr-title">Industry-Academia Connect</div>'));
    console.log('Includes Executive Portal title:', d.includes('<div class="hdr-title">Executive Portal</div>'));
  });
});
