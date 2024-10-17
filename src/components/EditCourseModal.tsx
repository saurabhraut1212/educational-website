import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface EditCourseModalProps {
    course: {
        _id: string;
        name: string;
        description: string;
        duration: number;
        instructor: string;
    };
    isOpen: boolean;
    onClose: () => void;
    onCourseUpdated: (updatedCourse: any) => void;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({ course, isOpen, onClose, onCourseUpdated }) => {
    const [name, setName] = useState(course.name);
    const [description, setDescription] = useState(course.description);
    const [duration, setDuration] = useState(course.duration);
    const [instructor, setInstructor] = useState(course.instructor);


    useEffect(() => {
        if (course) {
            setName(course.name);
            setDescription(course.description);
            setDuration(course.duration);
            setInstructor(course.instructor);
        }
    }, [course]);

    const handleSave = async () => {
        const token = localStorage.getItem('utoken');
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_SERVER_URL}/v1/course/${course._id}`,
                { name, description, duration, instructor },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                onCourseUpdated(response.data.data);
                toast.success('Course updated successfully!');
            }
        } catch (error) {
            console.error('Error updating the course:', error);
            toast.error('Error updating the course! Please try again.');
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogContent>
                <TextField
                    label="Course Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Duration (hours)"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Instructor"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditCourseModal;
