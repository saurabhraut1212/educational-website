import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CircularProgress, Alert, Pagination, Button, Box } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import EditCourseModal from './EditCourseModal';
import { useAuth } from '../context/AuthContext';

interface Course {
  _id: string;
  name: string;
  description: string;
  duration: number;
  instructor: string;
  createdBy: string;
}

const Courses: React.FC = () => {
  const { currentUserId } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('utoken');
      if (token) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/v1/course`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              itemsPerPage,
              pageCount: currentPage,
            },
          });

          setCourses(response.data.data.courses);
          setTotalCourses(response.data.data.totalCourses);
          setLoading(false);
        } catch (error) {
          setError('There was an error fetching the courses!');
          setLoading(false);
        }
      }
    };

    fetchCourses();
  }, [currentPage]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    const token = localStorage.getItem('utoken');
    try {
      const response = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/v1/course/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
        toast.success(`Course ${courseId} deleted successfully!`);
      }
    } catch (error) {
      console.error('Error deleting the course:', error);
      toast.error('Error deleting the course! Please try again.');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
      <Container>
        <Typography variant="h4" sx={{ mb: 4, mt: 4 }}>Courses Page</Typography>

        <Grid container spacing={4}>
          {courses.map(course => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={course._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '200px' }}>
                    <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                      {course.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      {course.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Duration: {course.duration} hours
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Instructor: {course.instructor}
                    </Typography>

                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEdit(course)}
                          disabled={currentUserId !== course.createdBy}
                      >
                        Edit
                      </Button>
                      <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDelete(course._id)}
                          disabled={currentUserId !== course.createdBy}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
          ))}
        </Grid>

        <Pagination
            count={Math.ceil(totalCourses / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{ mt: 4 }}
        />


        {selectedCourse && (
            <EditCourseModal
                course={selectedCourse}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onCourseUpdated={(updatedCourse) => {
                  setCourses((prevCourses) =>
                      prevCourses.map((c) => (c._id === updatedCourse._id ? updatedCourse : c))
                  );
                  setIsEditModalOpen(false);
                }}
            />
        )}
      </Container>
  );
};

export default Courses;
