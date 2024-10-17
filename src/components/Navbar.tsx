import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Education Website
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          {isAuthenticated && (
              <>
              <Button color="inherit" component={Link} to="/courses">Courses</Button>
              <Button color="inherit" component={Link} to="/createCourse">CreateCourse</Button>
              </>
          )}
          <Button color="inherit" component={Link} to="/contact">Contact</Button>
          {!isAuthenticated ? (
              <Button color="inherit" component={Link} to="/login">Login</Button>
          ) : (
              <Button color="inherit" onClick={logout}>Logout</Button>
          )}
        </Toolbar>
      </AppBar>
  );
};

export default Navbar;
