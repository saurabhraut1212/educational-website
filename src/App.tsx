import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Contacts from "./components/Contacts";
import Home from "./components/Home";
import Courses from "./components/Courses";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/contact" element={<Contacts />} />
      </Routes>
    </Router>
  );
};

export default App;
