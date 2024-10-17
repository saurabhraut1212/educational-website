import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { z } from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';


const courseSchema = z.object({
    name: z.string().min(1, 'Course name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    duration: z.number().positive('Duration must be a positive number').optional(),
    instructor: z.string().optional(),
});


type CourseData = z.infer<typeof courseSchema>;


interface CourseErrors {
    name?: string;
    description?: string;
    duration?: string;
    instructor?: string;
}

const CreateCourse: React.FC = () => {
    const [courseData, setCourseData] = useState<CourseData>({
        name: '',
        description: '',
        duration: undefined,
        instructor: '',
    });

    const [errors, setErrors] = useState<CourseErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCourseData((prevData) => ({
            ...prevData,
            [name]: name === 'duration' ? (value ? Number(value) : undefined) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        const result = courseSchema.safeParse(courseData);
        if (!result.success) {
            const formattedErrors: CourseErrors = {};
            result.error.errors.forEach((err) => {
                if (err.path[0]) {
                    formattedErrors[err.path[0] as keyof CourseErrors] = err.message;
                }
            });
            setErrors(formattedErrors);
            return;
        }

        try {
            const token = localStorage.getItem('utoken'); // Retrieve token from localStorage
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/v1/course`, courseData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            if (response.status === 201) {
                toast.success('Course created successfully!');
            } else {
                toast.error('Failed to create course!');
            }
            console.log(response.data);
            setCourseData({
                name: '',
                description: '',
                duration: undefined,
                instructor: '',
            });
            setErrors({});
        } catch (error) {
            const errorMessage = 'Something went wrong!';
            toast.error('Error creating course: ' + errorMessage);
            console.error('Error creating course:', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ mt: 4 }}>
                Create Course
            </Typography>
            <Box component="form" sx={{ mt: 4 }} onSubmit={handleSubmit}>
                <TextField
                    label="Course Name"
                    name="name"
                    fullWidth
                    value={courseData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{ mb: 3 }}
                />
                <TextField
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    fullWidth
                    value={courseData.description}
                    onChange={handleChange}
                    error={!!errors.description}
                    helperText={errors.description}
                    sx={{ mb: 3 }}
                />
                <TextField
                    label="Duration (in hours)"
                    name="duration"
                    type="number"
                    fullWidth
                    value={courseData.duration === undefined ? '' : courseData.duration}
                    onChange={handleChange}
                    error={!!errors.duration}
                    helperText={errors.duration}
                    sx={{ mb: 3 }}
                />
                <TextField
                    label="Instructor"
                    name="instructor"
                    fullWidth
                    value={courseData.instructor}
                    onChange={handleChange}
                    error={!!errors.instructor}
                    helperText={errors.instructor}
                    sx={{ mb: 3 }}
                />
                <Button variant="contained" color="primary" type="submit">
                    Create Course
                </Button>
            </Box>
        </Container>
    );
};

export default CreateCourse;
