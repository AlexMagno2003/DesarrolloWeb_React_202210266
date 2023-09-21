import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routers, Navigate,Routes, } from 'react-router-dom';
import Login from './components/Login'
import Home from './components/Home'
import Registro from './components/Registro'
import './App.css';

function App() {
  const [usuario, setUsuario] = useState('');
  const [registroAcademico, setRegistroAcademico] = useState('');
  const [inicioSesion, setInicioSesion] = useState(false);

  const updateUsuario = (nombre) => {
    setUsuario(nombre)
  }
  const updateinicioSesion = (estado) => {
    setInicioSesion(estado)
  }

  useEffect(() => {
    // Recuperar el token de sesión almacenado en el almacenamiento local
    const sessionToken = localStorage.getItem('sessionToken');
    const registroToken = localStorage.getItem('registroToken');
    const nombreToken = localStorage.getItem('nombreToken');
    if (sessionToken) {
      setInicioSesion(true);
      setRegistroAcademico(registroToken);
      setUsuario(nombreToken);
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={inicioSesion ? <Home usuario={usuario} registroAcademico={ registroAcademico } /> : <Login registroAcademico={ setRegistroAcademico} nombre={ updateUsuario} iniciar={updateinicioSesion} />}>
        </Route>
        <Route path='/login' element={<Login/>}>
        </Route>
        <Route path='/registro' element={<Registro/>}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
