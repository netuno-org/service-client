import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import _service from '@netuno/service-client';

_service.config({
    prefix: 'http://localhost:3000/'
});

function App() {
  const [response, setResponse] = useState("");
  _service({
      url: "/",
      success: (response) => {
          setResponse(response.text);
      },
      fail: (e) => {
          console.log("Reponse Error", e);
      }
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        { response }
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
