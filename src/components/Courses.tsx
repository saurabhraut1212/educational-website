import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

interface Course {
  id: number;
  name: string;
  description: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = "";
    //TODO: add token logic here
    // Retrieve token from environment variable
    axios.get(`${process.env.REACT_APP_SERVER_URL}/v1/course`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('There was an error fetching the courses!');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container>
      <Typography variant="h2">Courses Page</Typography>
      <List>
        {courses.map(course => (
          <ListItem key={course.id}>
            <ListItemText primary={course.name} secondary={course.description} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Courses;