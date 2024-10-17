import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { z } from 'zod';
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';


const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState<LoginData>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<Partial<LoginData>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = loginSchema.safeParse(loginData);
        if (!result.success) {
            const formattedErrors: Partial<LoginData> = {};
            result.error.errors.forEach((err) => {
                if (err.path[0]) {
                    formattedErrors[err.path[0] as keyof LoginData] = err.message;
                }
            });
            setErrors(formattedErrors);
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/v1/user/login`, loginData);
            const { user, token } = response.data;


            if (response.status === 200) {

                login(token);
                toast.success('Login successful!');
                navigate('/');
            } else {
                toast.error('Login failed! Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = 'Login failed! Please check your credentials.';
            toast.error(errorMessage);
        }
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ mt: 4 }}>
                Login
            </Typography>
            <Box component="form" sx={{ mt: 4 }} onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    value={loginData.email}
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
                    value={loginData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    sx={{ mb: 3 }}
                />
                <Button variant="contained" color="primary" type="submit">
                    Login
                </Button>


                <Typography variant="body1" sx={{ mt: 2 }}>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default Login;
