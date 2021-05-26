import React, { useState, useRef, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import _service from '@netuno/service-client';

_service.config({
    prefix: 'http://localhost:3000/'
});

function App() {
    const [response, setResponse] = useState("");
    const formUpload = useRef(null);
    useEffect(() => {
        if (response == "") {
            _service({
                url: "/",
                success: (response) => {
                    setResponse(response.text);
                },
                fail: (e) => {
                    console.log("Reponse Error", e);
                }
            });
        }
    });
    const handleJSONPost = (e) => {
        _service({
            method: "POST",
            url: "/",
            data: { name: "Sitana", site: "sitana.pt" },
            success: (response) => {
                setResponse(response.text);
            },
            fail: (e) => {
                console.log("Reponse Error", e);
            }
        });
    };
    const handleFormUploadSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(formUpload.current);
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
        return false;
    };
    const handleDownload = (e) => {
        _service({
            url: "/static/media/logo.6ce24c58.svg",
            data: { name: "Sitana", site: "sitana.pt" },
            blob: true,
            success: (response) => {
                const file = window.URL.createObjectURL(response.blob);
                window.location.assign(file);
            },
            fail: (e) => {
                console.log("Reponse Error", e);
            }
        });
    };
    _service.config({ headers: { "Authorization": "Bearer ..." } });
    console.log("Service Config with custom header.", _service.config());
    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <h2>Get Content</h2>
            { response }
            <h2>Post JSON</h2>
            <button onClick={handleJSONPost}>JSON Post</button>
            <form ref={formUpload} onSubmit={handleFormUploadSubmit} style={{padding: '20px', textAlign: 'left'}}>
              <h2>Post Upload</h2>
              <div>
                Name: <input type="text" name="name" />
              </div>
              <div>
                File: <input type="file" name="file" />
              </div>
              <button type="submit">Submit</button>
            </form>
            <h2>Blob</h2>
            <button onClick={handleDownload}>Download File</button>
          </header>
        </div>
    );
}

export default App;
