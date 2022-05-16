const _service = require('@netuno/service-client');

_service.config({
    prefix: global.api.services.prefix
});

describe("BLOB", () => {
  for (const method of ['get', 'post', 'patch', 'put', 'delete']) {
    test(method, (done) => {
      _service({
        method,
        url: "/simple",
        data: { name: "Test Name", test: true },
        blob: true,
        timeout: 500,
        success: (response) => {
          if (response.blob) {
            console.log("Service Response", response.blob);
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
