import React from 'react';
import './App.css';
import { AuthProvider } from './Providers/auth.provider';
import { Routes } from './Routes/routes';
import { SignIn } from './Screens/auth.screens';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
    <Routes />
   </AuthProvider>
   </BrowserRouter>
  );
}

export default App;
