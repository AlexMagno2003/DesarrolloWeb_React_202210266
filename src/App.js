import logo from './logo.svg';
import React, { useState } from 'react';
import { BrowserRouter, Route, Routers, Navigate,Routes, } from 'react-router-dom';
import Login from './components/Login'
import Home from './components/Home'
import Registro from './components/Registro'
import './App.css';

function App() {
  const [usuario, setUsuario] = useState('');
  const [inicioSesion, setInicioSesion] = useState(false);

  const updateUsuario = (nombre) => {
    setUsuario(nombre)
  }
  const updateinicioSesion = (estado) => {
    setInicioSesion(estado)
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={inicioSesion ? <Home usuario={ usuario} /> : <Login registroAcademico={ updateUsuario} iniciar={updateinicioSesion} />}>
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
