const https = require('https');
https.get('https://raw.githubusercontent.com/Mohan171820/iic-mou-dashboard/main/public/chairperson.html', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('GitHub raw has Industry-Academia Connect:', d.includes('Industry-Academia Connect'));
    console.log('GitHub raw has hdr-title with IAC:', d.includes('<div class="hdr-title">Industry-Academia Connect</div>'));
  });
});
