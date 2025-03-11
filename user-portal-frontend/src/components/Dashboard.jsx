import { Button, Container, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function Dashboard() {
  const [user, setUser] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user?.role && user.role == 'admin') {
      setUser(user);
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <Container component='main' maxWidth='xs'>
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant='h4'>Welcome {user?.email}</Typography>

        <Button
          fullWidth
          variant='contained'
          sx={{ mt: 3, mb: 2 }}
          onClick={() => {
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
            navigate('/login');
          }}
        >
          Back To Login
        </Button>
      </Paper>
    </Container>
  );
}
