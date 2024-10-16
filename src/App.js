// src/App.js
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterStudent from './components/RegisterStudent';
import AnalyzeGroupPhoto from './components/AnalyzeGroupPhoto';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Student Attendance Tracker</h1>
          <nav>
            <ul>
              <li>
                <Link to="/register">Register Students</Link>
              </li>
              <li>
                <Link to="/analyze">Analyze Group Photo</Link>
              </li>
            </ul>
          </nav>
        </header>
        <Routes>
          {/* Route for the Register component */}
          <Route path="/register" element={<RegisterStudent />} />
          
          {/* Route for the AnalyzeGroupPhoto component */}
          <Route path="/analyze" element={<AnalyzeGroupPhoto />} />
          
          {/* Default route */}
          <Route
            path="/"
            element={
              <div className="welcome">
                <h2>Welcome to the Attendance Tracker App</h2>
                <p>Use the navigation links to register students or analyze a group photo.</p>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
