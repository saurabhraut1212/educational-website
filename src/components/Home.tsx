import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Home: React.FC = () => (
    <Container
        maxWidth="lg"
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',


        }}
    >
        <Typography variant="h2" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
            Home Page
        </Typography>
        <Typography
            variant="h6"
            sx={{
                textAlign: 'center',
                color: '#666',
                maxWidth: '600px'
            }}
        >
            Welcome to our education website! Explore our courses and resources to enhance your learning experience.
        </Typography>
    </Container>
);

export default Home;
