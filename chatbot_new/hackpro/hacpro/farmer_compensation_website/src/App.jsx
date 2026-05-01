import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import AdminUploadImage from "./Pages/Adminuploadimages";
import AdminDashboard from "./Pages/Admindashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/adminupload" element={<AdminUploadImage />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

