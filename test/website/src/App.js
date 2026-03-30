import React, { useState, useRef, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import _service from '@netuno/service-client';

_service.config({
  prefix: 'http://localhost:9000/services'
});

function App() {
  const [responseGET, setResponseGET] = useState("");
  const [responsePATCH, setResponsePATCH] = useState("");
  const [responsePOST, setResponsePOST] = useState("");
  const [responsePUT, setResponsePUT] = useState("");
  const [responseDELETE, setResponseDELETE] = useState("");
  const [responseUploadPOST, setResponseUploadPOST] = useState("");
  const [responseUploadPUT, setResponseUploadPUT] = useState("");
  const formUploadPOST = useRef(null);
  const formUploadPUT = useRef(null);
  useEffect(() => {
  }, []);
  const handleGET = (e) => {
    _service({
      method: "get",
      url: "/simple",
      data: { name: 'Test Name', test: true },
      start: () => {
        console.log("GET Start");
      },
      success: (response) => {
        console.log("GET Success");
        if (response.text) {
          setResponseGET(response.text);
        }
        if (response.json) {
          setResponseGET(JSON.stringify(response.json));
        }
      },
      fail: (e) => {
        console.log("GET Reponse Error", e);
      },
      end: () => {
        console.log("GET End");
      }
    });
  };
  const handlePATCH = (e) => {
    _service({
      method: "patch",
      url: "/simple",
      data: { name: 'Test Name', test: true },
      start: () => {
        console.log("PATCH Start");
      },
      success: (response) => {
        console.log("PATCH Success");
        if (response.text) {
          setResponsePATCH(response.text);
        }
        if (response.json) {
          setResponsePATCH(JSON.stringify(response.json));
        }
      },
      fail: (e) => {
        console.log("PATCH Reponse Error", e);
      },
      end: () => {
        console.log("PATCH End");
      }
    });
  };
  const handlePOST = (e) => {
    _service({
      method: "post",
      url: "/simple",
      data: { name: 'Test Name', test: true },
      start: () => {
        console.log("POST Start");
      },
      success: (response) => {
        console.log("POST Success");
        if (response.text) {
          setResponsePOST(response.text);
        }
        if (response.json) {
          setResponsePOST(JSON.stringify(response.json));
        }
      },
      fail: (e) => {
        console.log("POST Reponse Error", e);
      },
      end: () => {
        console.log("POST End");
      }
    });
  };
  const handlePUT = (e) => {
    _service({
      method: "put",
      url: "/simple",
      data: { name: 'Test Name', test: true },
      start: () => {
        console.log("PUT Start");
      },
      success: (response) => {
        console.log("PUT Success");
        if (response.text) {
          setResponsePUT(response.text);
        }
        if (response.json) {
          setResponsePUT(JSON.stringify(response.json));
        }
      },
      fail: (e) => {
        console.log("PUT Reponse Error", e);
      },
      end: () => {
        console.log("PUT End");
      }
    });
  };
  const handleDELETE = (e) => {
    _service({
      method: "delete",
      url: "/simple",
      data: { name: 'Test Name', test: true },
      start: () => {
        console.log("DELETE Start");
      },
      success: (response) => {
        console.log("DELETE Success");
        if (response.text) {
          setResponseDELETE(response.text);
        }
        if (response.json) {
          setResponseDELETE(JSON.stringify(response.json));
        }
      },
      fail: (e) => {
        console.log("DELETE Reponse Error", e);
      },
      end: () => {
        console.log("DELETE End");
      }
    });
  };
  const handleFormUploadPOST = (e) => {
    e.preventDefault();
    const formData = new FormData(formUploadPOST.current);
    formData.append('name', 'Test Name');
    formData.append('test', true);
    _service({
      method: "POST",
      url: "/upload",
      data: formData,
      start: () => {
        console.log("Upload POST Start");
      },
      success: (response) => {
        if (response.text) {
          setResponseUploadPOST(response.text);
        }
        if (response.json) {
          setResponseUploadPOST(JSON.stringify(response.json));
        }
      },
      fail: (e) => {
        console.log("Upload POST Reponse Error", e);
      },
      end: () => {
        console.log("Upload POST End");
      },
    });
    return false;
  };
  const handleFormUploadPUT = (e) => {
    e.preventDefault();
    const formData = new FormData(formUploadPUT.current);
    formData.append('name', 'Test Name');
    formData.append('test', true);
    _service({
      method: "PUT",
      url: "/upload",
      data: formData,
      start: () => {
        console.log("Upload PUT Start");
      },
      success: (response) => {
        if (response.text) {
          setResponseUploadPUT(response.text);
        }
        if (response.json) {
          setResponseUploadPUT(JSON.stringify(response.json));
        }
      },
      fail: (e) => {
        console.log("Upload PUT Reponse Error", e);
      },
      end: () => {
        console.log("Upload PUT End");
      }
    });
    return false;
  };
  const handleDownload = (e) => {
    _service({
      url: "/download",
      data: { name: 'Test Name', test: true },
      blob: true,
      start: () => {
        console.log("Download Start");
      },
      success: (response) => {
        const file = window.URL.createObjectURL(response.blob);
        window.location.assign(file);
      },
      fail: (e) => {
        console.log("Reponse Error", e);
      },
      end: () => {
        console.log("Download End");
      }
    });
  };
  // AUTHORIZATION TOKEN:
  // _service.config({ headers: { "Authorization": "Bearer ..." } });
  // console.log("Service Config with custom header.", _service.config());
  return (
    <div className="App">
      <h2>JSON Requests</h2>
      <button onClick={handleGET}>GET</button>
      {responseGET}
      <hr/>
      <button onClick={handlePATCH}>PATCH</button>
      {responsePATCH}
      <hr/>
      <button onClick={handlePOST}>POST</button>
      {responsePOST}
      <hr/>
      <button onClick={handlePUT}>PUT</button>
      {responsePUT}
      <hr/>
      <button onClick={handleDELETE}>DELETE</button>
      {responseDELETE}
      <hr/>
      <form ref={formUploadPOST} onSubmit={handleFormUploadPOST} style={{padding: '20px', textAlign: 'left'}}>
        <h2>Upload POST</h2>
        <div>
          File: <input type="file" name="image" />
        </div>
        <p>
          <button type="submit">Submit</button>
        </p>
        {responseUploadPOST}
      </form>
      <form ref={formUploadPUT} onSubmit={handleFormUploadPUT} style={{padding: '20px', textAlign: 'left'}}>
        <h2>Upload PUT</h2>
        <div>
          File: <input type="file" name="image" />
        </div>
        <p>
          <button type="submit">Submit</button>
        </p>
        {responseUploadPUT}
      </form>
      <h2>Blob</h2>
      <button onClick={handleDownload}>Download File</button>
    </div>
  );
}

export default App;
