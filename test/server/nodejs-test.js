const _service = require('@netuno/service-client');

const testCall = require('./nodejs-test-call');

_service.config({
  prefix: 'http://localhost:9000/services/'
});

testCall();
