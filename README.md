# service-client

Client to integrations with Netuno Services.

More about the [Netuno Platform](https://netuno.org/).

### Install

`npm i -S @netuno/service-client`

### Import

`import _service from '@netuno/service-client';`

### Config

Define the prefix to be used with all URLs:

```
_service.config({
    prefix: 'http://localhost:9000/services/'
});
```

Any setting passed to service call can be configured globally.

### Usage

You can set any `fetch` parameters, like `mode`, `credentials`, `headers`.

##### GET Text or JSON

```
  _service({
      url: "/services/my-get-service",
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
```

##### Simple JSON POST

With `fetch` `mode` as `no-cors`:

```
  _service({
      url: "/services/my-post-service",
      method: 'POST',
      mode: "no-cors",
      body: JSON.stringify({ param1: "1", param2: "2" }),
      success: (response) => {
          if (response.json) {
              console.log("Service Response", response.json);
          }
      },
      fail: (e) => {
          console.log("Service Error", e);
      }
  });
```

##### POST JSON with ReactJS and Ant.Design:

Imports:

```
import { notification } from 'antd';
import _service from '@netuno/service-client';
```

Save event will send the values object as JSON:

```
handleSave(values) {
    this.setState({ loading: true });
    const fail = () => {
        this.setState({ loading: false });
        notification["error"]({
            message: 'Error',
            description: 'Your data could not be saved.',
            style: {
                marginTop: 100
            }
        });
    };
    _service({
        url: '/services/my-post-service',
        method: 'POST',
        body: JSON.stringify(values),
        success: (response) => {
            if (response.json.result === true) {
                notification["success"]({
                    message: 'Success',
                    description: 'Your data has been saved.',
                    style: {
                        marginTop: 100
                    }
                });
                this.setState({
                    loading: false
                });
            } else {
                fail();
            }
        },
        fail: (e) => {
            console.log("Service failed.", e);
            fail();
        }
    });
}
```
