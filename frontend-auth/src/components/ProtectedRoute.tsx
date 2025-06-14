import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getUser } from '../utils/auth';

interface Props {
  children: JSX.Element;
  requiredRole?: string; // nuevo prop opcional
}

const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && !user.roles?.includes(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
