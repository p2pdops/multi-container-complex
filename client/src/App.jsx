import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OtherPage from './OtherPage';
import Fib from './Fib';
import React, { Fragment } from 'react';

function App() {
  return (
    <Router>
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
