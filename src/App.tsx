
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Courses from './components/Courses';
import Contact from './components/Contacts';
import Navbar from './components/Navbar';
import Login from "./components/Auth/Login"
import Signup from "./components/Auth/Signup";
import CreateCourse from "./components/CreateCourse";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/courses"
                    element={
                        <ProtectedRoute>
                            <Courses />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/createcourse"
                    element={
                        <ProtectedRoute>
                            <CreateCourse />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;