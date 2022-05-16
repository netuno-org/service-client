const fs = require('fs');
const _service = require('@netuno/service-client');

_service.config({
    prefix: global.api.services.prefix
});

describe("UPLOAD", () => {
  for (const method of ['post', 'patch', 'put']) {
    test(method, (done) => {
      fs.readFile("../public/images/logo.png", (err, file) => {
        file.fileName = 'logo.png';
        _service({
          method,
          url: "/upload",
          data: { name: "Test Name", test: true, "image": file },
          success: (response) => {
            if (response.json) {
              console.log("Service Response", response.json);
            }
            done();
          },
          fail: (e) => {
            console.log("Service Error", e);
            done('Service Error: '+ e.error);
          }
        });
      });
    });
  }
});
