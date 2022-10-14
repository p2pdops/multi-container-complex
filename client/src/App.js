import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import OtherPage from './OtherPage';
import Fib from './Fib';
import React, { Fragment } from 'react';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <h1>Fib Calculator Version: 1</h1>
          <Link to="/">Home</Link>
          <Link to="/otherpage">Other Page</Link>
        </header>
      </div>
      <Fragment>
        <Routes>
          <Route path="/otherpage" element={<OtherPage />} />
          <Route path="/" element={<Fib />} />
        </Routes>
      </Fragment>
    </Router>
  );
}

export default App;
