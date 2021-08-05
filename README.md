# service-client

<a href="https://www.npmjs.com/package/@netuno/service-client"><img src="https://img.shields.io/npm/v/@netuno/service-client.svg?style=flat" alt="npm version"></a>

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

Default config parameters:

```
{
    prefix: '',
    url: '',
    method: 'GET',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'Accept':  'application/json'
    },
    success: (data) => { },
    fail: (data) => {}
}
```

### Usage

In the global configuration (`_service.config({...})`) or with the object passed to the service function (`_service({...})`), you can set or override any `fetch` parameters, like `mode`, `credentials`, `headers`, etc.

The `data` is automatically converted to the body content.

##### GET Text or JSON

```
  _service({
      url: "/services/my-get-service",
      data: { param1: "1", param2: "2" },
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

By default is submitted as JSON:

```
  _service({
      url: "/services/my-post-service",
      method: 'POST',
      data: { param1: "1", param2: "2" },
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

##### Form Upload

Load the FormData with the file field and send it:

```
const formData = new FormData();
formData.append('file', input.files[0]);
formData.append('otherField', 'value...');
_service({
    method: "POST",
    url: "/",
    data: formData,
    success: (response) => {
        setResponse(response.text);
    },
    fail: (e) => {
        console.log("Reponse Error", e);
    }
});
```

Load the FormData object from a ReactJS form reference:

```
_service({
    method: "POST",
    url: "/",
    data: new FormData(formUpload.current),
    success: (response) => {
        setResponse(response.text);
    },
    fail: (e) => {
        console.log("Reponse Error", e);
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
        data: values,
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

##### BLOB

Download file:

```
  _service({
      url: "/services/my-downloadable-service",
      method: 'POST',
      data: { param1: "1", param2: "2" },
      blob: true,
      success: (response) => {
          const { blob } = response;
          if (blob) {
              const file = window.URL.createObjectURL(blob);
              window.location.assign(file);
          }
      },
      fail: (e) => {
          console.log("Service Error", e);
      }
  });
```

To download file with a custom name you can use the module [DownloadJS](https://www.npmjs.com/package/downloadjs):

`npm install -S downloadjs`

Then the sample code:

```
import _service from '@netuno/service-client';
import download from 'downloadjs';

...

  _service({
      url: "/services/my-downloadable-service",
      blob: true,
      success: (response) => {
          const { blob } = response;
          if (blob) {
              // Excel XLS
              download(blob, "my-excel.xls", "application/vnd.ms-excel");
              // PDF
              download(blob, "my-pdf.pdf", "application/pdf");
          }
      },
      fail: (e) => {
          console.log("Service Error", e);
      }
  });

...

```
