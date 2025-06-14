import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import LoginForm from '../../components/LoginForm/loginForm';
import Navbar from '../../components/Navbar/Navbar';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (getToken()) {
      navigate('/');
    }
  }, []);

  return (
    <>
      <Navbar />
      <LoginForm />
    </>
  );
};

export default LoginPage;
