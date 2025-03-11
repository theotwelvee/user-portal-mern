import { Visibility } from '@mui/icons-material';
import { VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid2,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as yup from 'yup';

const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be of minimum 6 characters long')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export default function AdminRegister() {
  let navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegisterAdmin = (values) => {
    setLoading(true);
    setError('');
    setSuccess('');

    const { confirmPassword, ...submitData } = values;

    const userData = { ...submitData, role: 'admin' };

    axios
      .post('http://localhost:5000/api/auth/register', userData)
      .then((res) => {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1000 * 4);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || 'Registration failed. Please try again'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'admin',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => handleRegisterAdmin(values),
  });

  return (
    <div>
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: 4,
          alignItems: 'center',
        }}
      >
        <Typography variant='h4'>Sign Up</Typography>

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

        <Box component='form' onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <Grid2
            container
            sx={{ display: 'flex', flexDirection: 'column' }}
            spacing={2}
          >
            <Grid2 item size={{ sm: 12 }}>
              <TextField
                autoComplete='firstName'
                name='firstName'
                required
                fullWidth
                id='firstName'
                label='First Name'
                autoFocus
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid2>
            <Grid2 item size={{ sm: 12 }}>
              <TextField
                autoComplete='lastName'
                name='lastName'
                required
                fullWidth
                id='lastName'
                label='Last Name'
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name='password'
                label='Password'
                type={showPassword ? 'text' : 'password'}
                id='password'
                autoComplete='new-password'
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
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
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name='confirmPassword'
                label='Confirm Password'
                type={showConfirmPassword ? 'text' : 'password'}
                id='confirmPassword'
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle confirm password visibility'
                        onClick={handleClickShowConfirmPassword}
                        edge='end'
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>
          </Grid2>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
          <Grid2 container justifyContent='flex-end'>
            <Grid2 item>
              <Link href='/login' variant='body2'>
                Already have an account? Sign in
              </Link>
            </Grid2>
          </Grid2>
        </Box>
      </Paper>
    </div>
  );
}
