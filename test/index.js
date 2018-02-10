const client = require('../');

const request = new client.HostPortRequest(
  'www.google.com',
  80,
  '',
  {
    verbose: true,
    correlationHeaderName: 'X-Unity-CorrelationId'
  }
);

request.get('')
  .then(res => console.log(res.body))
  .catch(err => console.log(err));