import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Password confirmation must be at least 6 characters long'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type SignupData = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [signupData, setSignupData] = useState<SignupData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Partial<SignupData>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignupData({
            ...signupData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = signupSchema.safeParse(signupData);
        if (!result.success) {
            const formattedErrors: Partial<SignupData> = {};
            result.error.errors.forEach((err) => {
                if (err.path[0]) {
                    formattedErrors[err.path[0] as keyof SignupData] = err.message;
                }
            });
            setErrors(formattedErrors);
            return;
        }

        try {
            console.log(signupData, 'signupdata');
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/v1/user/signup`, signupData);


            if (response.status === 201) {
                toast.success('Signup successful!');
                console.log(response.data);
                navigate('/login');
            } else {
                toast.error('Signup failed! Please try again.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            const errorMessage = 'Signup failed! Please try again.';
            toast.error(errorMessage);
        }
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ mt: 4 }}>
                Signup
            </Typography>
            <Box component="form" sx={{ mt: 4 }} onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    name="name"
                    fullWidth
                    value={signupData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{ mb: 3 }}
                />
                <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    value={signupData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{ mb: 3 }}
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    value={signupData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    sx={{ mb: 3 }}
                />
                <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    fullWidth
                    value={signupData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    sx={{ mb: 3 }}
                />
                <Button variant="contained" color="primary" type="submit">
                    Signup
                </Button>

                <Typography variant="body1" sx={{ mt: 2 }}>
                    Already have an account? <Link to="/login">Login</Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default Signup;
