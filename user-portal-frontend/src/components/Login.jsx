import React, { useState } from 'react';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid2,
  Box,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router';
import axios from 'axios';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be of minimum 6 characters long')
    .required('Password is required'),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');

      try {
        await axios
          .post('http://localhost:5000/api/auth/login', values)
          .then((res) => {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userInfo', JSON.stringify(res.data.user));

            if (res.data.user.role === 'admin') {
              setSuccess('Login successful! Redirecting to dashboard...');

              setTimeout(() => {
                navigate('/dashboard');
              }, 1000 * 4);
            } else {
              setError('You are not allowed to login from here');
            }
          });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Login failed. Please check your credentials and try again.'
        );
      } finally {
        setLoading(false);
      }
    },
  });

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
        <Avatar sx={{ margin: 1, backgroundColor: 'primary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>

        {error && (
          <Alert severity='error' sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity='success' sx={{ width: '100%', mt: 2 }}>
            {success}
          </Alert>
        )}

        <Box component='form' onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            margin='normal'
            fullWidth
            name='password'
            label='Password'
            type={showPassword ? 'text' : 'password'}
            id='password'
            autoComplete='current-password'
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword}
                    edge='end'
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          <Grid2
            container
            spacing={2}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <Grid2 item size={{ md: 6, sm: 6 }}>
              <Link href='/register-customer' variant='body2'>
                Customer Sign Up
              </Link>
            </Grid2>
            <Grid2 item size={{ md: 6, sm: 6 }}>
              <Link href='/register-admin' variant='body2'>
                Admin Sign Up
              </Link>
            </Grid2>
          </Grid2>
        </Box>
      </Paper>
    </Container>
  );
}
