import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FontIconPickerPage from './pages/FontIconPickerPage';

function App() {
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/fontpicker-page">Click to go to FontIconPicker Page</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/fontpicker-page" element={<FontIconPickerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
