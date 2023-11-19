import React from 'react';
import './App.css';
import { AuthProvider } from './Providers/auth.provider';
import { Routes } from './Routes/routes';
import { SignIn } from './Screens/auth.screens';

function App() {
  return (
   <AuthProvider>
    <Routes />
   </AuthProvider>
  );
}

export default App;
