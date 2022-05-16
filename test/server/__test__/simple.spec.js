const _service = require('@netuno/service-client');

_service.config({
    prefix: global.api.services.prefix
});

describe("SIMPLE", () => {
  for (const method of ['get', 'post', 'patch', 'put', 'delete']) {
    test(method, (done) => {
      _service({
        method,
        url: "/simple",
        data: { name: "Test Name", test: true },
        timeout: 500,
        success: (response) => {
          if (response.text) {
            console.log("Service Response", response.text);
          }
          if (response.json) {
            console.log("Service Response", response.json);
          }
          done();
        },
        fail: (e) => {
          console.log("Service Error", e);
          done('Service Error: '+ JSON.stringify(e));
        }
      });
    });
  }
});
