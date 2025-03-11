import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import Login from './components/Login';
import CustomerRegister from './components/CustomerRegister';
import AdminRegister from './components/AdminRegister';
import Dashboard from './components/Dashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#e91e63',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/register-customer' element={<CustomerRegister />} />
          <Route path='/register-admin' element={<AdminRegister />} />
          <Route path='/login' element={<Login />}></Route>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/' element={<Navigate to='/login' />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
