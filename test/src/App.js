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
          </header>
        </div>
    );
}

export default App;
