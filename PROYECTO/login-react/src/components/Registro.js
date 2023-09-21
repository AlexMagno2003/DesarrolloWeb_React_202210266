import React, { useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom";

function Registro({ registrarUsuario }) {
  const [registroAcademico, setRegistroAcademico] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [correo, setCorreo] = useState('');
  const [errorResponse, setErrorResponse] = useState("");
  
  const goTo = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const nuevoUsuario = {
      registro_academico: registroAcademico,
      email: correo,
      nombre: nombres,
      apellidos: apellidos,
      contrasena: contrasena
    };

    const response = await registrarUsuario('http://localhost:4000/registro', nuevoUsuario);
    if (response.error) {
          setErrorResponse(response.error);
        } else {
          console.log('Usuario registrado con éxito');
        goTo("/");
        }
    };
    
 async function registrarUsuario(url = '', data = {}) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

  return (
    <div>
      <form onSubmit={handleSubmit} class="form">
      <h2>Registrar un Usuario</h2>
        {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
        <label>Registro Academico</label>
        <input type="number" value={registroAcademico} onChange={(e) => setRegistroAcademico(e.target.value)} required />
              
        <label>Nombres</label>
        <input type="text" value={nombres} onChange={(e) => setNombres(e.target.value)} required />
        
        <label>Apellidos</label>
        <input type="text" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
        
        <label>Contraseña</label>
        <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
        
        <label>Correo electrónico</label>
        <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default Registro;
