import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import { z } from 'zod';
import { toast } from 'react-hot-toast';


const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required').max(500, 'Message cannot exceed 500 characters'),
});

type ContactData = z.infer<typeof contactSchema>;

const Contact: React.FC = () => {
  const [contactData, setContactData] = useState<ContactData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<ContactData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    const result = contactSchema.safeParse(contactData);
    if (!result.success) {
      const formattedErrors: Partial<ContactData> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          formattedErrors[err.path[0] as keyof ContactData] = err.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/v1/contact/createContact`, contactData);
      toast.success('Message sent successfully!'); // Show success toast
      console.log(response.data);
      setContactData({ name: '', email: '', message: '' });
      setErrors({});
    } catch (error) {
      console.error('There was an error sending the message!', error);
      toast.error('There was an error sending the message!');
    }
  };

  return (
      <Container>
        <Typography variant="h4" sx={{ mt: 4 }}>Contact Page</Typography>
        <Box component="form" sx={{ mt: 4 }} onSubmit={handleSubmit}>
          <TextField
              label="Name"
              name="name"
              fullWidth
              value={contactData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ mb: 3 }}
          />
          <TextField
              label="Email"
              name="email"
              fullWidth
              value={contactData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 3 }}
          />
          <TextField
              label="Message"
              name="message"
              fullWidth
              multiline
              rows={4}
              value={contactData.message}
              onChange={handleChange}
              error={!!errors.message}
              helperText={errors.message}
              sx={{ mb: 3 }}
          />
          <Button variant="contained" color="primary" type="submit">Submit</Button>
        </Box>
      </Container>
  );
};

export default Contact;
