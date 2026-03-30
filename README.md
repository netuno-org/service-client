# service-client

REST and HTTP client optimized for Netuno Platform services integrations.

<a href="https://www.npmjs.com/package/@netuno/service-client"><img src="https://img.shields.io/npm/v/@netuno/service-client.svg?style=flat" alt="npm version"></a>

See more about the [Netuno Platform](https://netuno.org/): open source, low-code, and polyglot.

## Install

```shell
bun add @netuno/service-client
```

## Import

```javascript
import _service from '@netuno/service-client';
```

## Config

Define the prefix to be used with all URLs:

```javascript
_service.config({
    prefix: 'http://localhost:9000/services/'
});
```

Any setting passed to service call can be configured globally.

Default config parameters:

```javascript
{
    prefix: '',
    url: '',
    method: 'GET',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'Accept':  'application/json'
    },
    start: () => { },
    success: (data) => { },
    fail: (data) => {},
    end: () => { }
}
```

## Usage

In the global configuration (`_service.config({...})`) or with the object passed to the service function (`_service({...})`), you can set or override any `fetch` parameters, like `mode`, `credentials`, `headers`, etc.

The `data` is automatically converted to the body content.

### GET Text or JSON

```javascript
  _service({
      url: "/services/my-get-service",
      data: { param1: "1", param2: "2" },
      start: () => {
          console.log("Service request starting.");
      },
      success: (response) => {
          if (response.text) {
              console.log("Service Response", response.text);
          }
          if (response.json) {
              console.log("Service Response", response.json);
          }
      },
      fail: (error) => {
          console.log("Service Error", error);
      },
      end: () => {
          console.log("Service request ended.");
      }
  });
```

### Simple JSON POST

By default is submitted as JSON:

```javascript
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

### Form Upload

Load the FormData with the file field and send it:

```javascript
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

```javascript
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

### BLOB

Download file:

```javascript
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

```jsx
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

### Service URL

To get the full service URL with the prefix:

```javascript
const avatarLink = _service.url(`/profile/avatar?uid=${uidAvatar}`)
```

### POST JSON with React and Ant.Design:

Imports:

```javascript
import React, {useState} from "react";
import { Form, notification } from 'antd';
import _service from '@netuno/service-client';
```

Define the loading state:

```javascript
const [loading, setLoading] = useState(false);
```

Save event will send the values object as JSON:

```javascript
const onFinish = (values) => {
    const failNotify = () => {
        notification.error({
            title: 'Error',
            description: 'Your data could not be saved.'
        });
    };
    _service({
        url: '/services/my-post-service',
        method: 'POST',
        data: values,
        start: () => {
            setLoading(true);
        },
        success: ({json}) => {
            if (json.result === true) {
                notification.success({
                    title: 'Success',
                    description: 'Your data has been saved.'
                });
            } else {
                failNotify();
            }
        },
        fail: (e) => {
            console.log("Service failed.", e);
            failNotify();
        },
        end: () => {
            setLoading(false);
        },
    });
};
```

In the Ant.Design Form component uses the finish callback function:

```jsx
    <Form onFinish={onFinish}>
        ...
    </Form>
```


### Upload Form with React and Ant.Design

Here a full example of how upload a form using Ant.Design and FormData:

```jsx
import {useState} from 'react';
import _service from '@netuno/service-client';
import {Button, Form, Input, Upload, notification} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

function UploadForm() {
    const [loading, setLoading] = useState(false);
    const onFinish = (values)=> {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("file", values.file.fileList[0].originFileObj);
        _service({
            method: "POST",
            url: "file/save",
            data: formData,
            start: () => {
                setLoading(true);
            },
            success: () => {
                notification.success({
                    title: 'Upload Form',
                    description: 'Your data was successfully saved.'
                });
            },
            fail: (e) => {
                console.error("Upload Form Failed", e);
                notification.error({
                    title: 'Upload Form',
                    description: 'Unable to save your data.'
                });
            },
            end: () => {
                setLoading(false);
            }
        });
    };
    return (
        <Form onFinish={onFinish} layout="vertical">
            <Form.Item label="Title" name="title"
                rules={[{ required: true, message: 'Please input your title.' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item label="File" name="file"
                rules={[{ required: true, message: 'Please choose your file.' }]}
            >
                <Upload listType="text" maxCount={1}>
                    <button type="button" style={{color: 'inherit', cursor: 'inherit', border: 0, background: 'inherit'}}>
                        <PlusOutlined />
                        <div style={{marginTop: 8}}>Upload</div>
                    </button>
                </Upload>
            </Form.Item>
            <Form.Item label={null}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}

export default UploadForm;
```
