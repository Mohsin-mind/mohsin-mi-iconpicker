import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import FontIconPickerPage from "./pages/FontIconPickerPage";
import Instagram from "./pages/Instagram";
import GoogleMap from "./pages/Map";
import GaugeComponent from "./pages/GaugeComponent";
import FormBuilder from "./pages/FormBuilder/index";
import ZustandCart from "./pages/ZustandCart";

function App() {
  return (
    <Router>
      <div className="h-screen flex gap-x-3">
        <nav className="h-full">
          <ul>
            <li>
              <Link
                style={{ color: "blue", textDecoration: "underline" }}
                to="/fontpicker-page"
              >
                FontIconPicker Page
              </Link>
            </li>
            <li>
              <Link
                style={{ color: "blue", textDecoration: "underline" }}
                to="/instagram"
              >
                Instagram Login Page
              </Link>
            </li>
            <li>
              <Link
                style={{ color: "blue", textDecoration: "underline" }}
                to="/google-map"
              >
                Go to Map
              </Link>
            </li>
            <li>
              <Link
                style={{ color: "blue", textDecoration: "underline" }}
                to="/gauge-component"
              >
                Gauge Component
              </Link>
            </li>
            <li>
              <Link
                style={{ color: "blue", textDecoration: "underline" }}
                to="/form-builder"
              >
                Form Builder
              </Link>
            </li>
            <li>
              <Link
                style={{ color: "blue", textDecoration: "underline" }}
                to="/zustand-cart"
              >
                Zustand cart example
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/fontpicker-page" element={<FontIconPickerPage />} />
          <Route path="/instagram" element={<Instagram />} />
          <Route path="/google-map" element={<GoogleMap />} />
          <Route path="/gauge-component" element={<GaugeComponent />} />
          <Route path="/form-builder" element={<FormBuilder />} />
          <Route path="/zustand-cart" element={<ZustandCart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
