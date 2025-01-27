import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FontIconPickerPage from './pages/FontIconPickerPage';
import Instagram from './pages/Instagram';
import GoogleMap from './pages/Map';

function App() {
  return (
    <Router>
      <div className='h-screen'>
        <nav>
          <ul>
            <li>
              <Link style={{ color: 'blue', textDecoration: 'underline' }} to="/fontpicker-page">FontIconPicker Page</Link>
            </li>
            <li>
              <Link style={{ color: 'blue', textDecoration: 'underline' }} to="/instagram">Instagram Login Page</Link>
            </li>
            <li>
              <Link style={{ color: 'blue', textDecoration: 'underline' }} to="/google-map">Go to Map</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/fontpicker-page" element={<FontIconPickerPage />} />
          <Route path="/instagram" element={<Instagram />} />
          <Route path="/google-map" element={<GoogleMap />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
