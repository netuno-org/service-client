import _service from '@netuno/service-client';

_service.config({
	prefix: 'https://www.sitana.pt'
});

_service({
    method: 'GET',
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
    },
    fail: (e) => {
        console.log("Service Error", e);
    }
});

