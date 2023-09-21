import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from "react-router-dom";
function Login({ registroAcademico, nombre, iniciar }) {
    
    const [errorResponse, setErrorResponse] = useState("");
    const handleSubmit = (event) => {
        event.preventDefault();
        const registroAcademicoInput = event.currentTarget.registroInput.value;
        const contra = event.currentTarget.passwdInput.value;
        iniciarSesion('http://localhost:4000/login', { usuario: registroAcademicoInput, contra: contra }).then((value) => {    
            
            if (value.error != undefined) {
                setErrorResponse(value.error);
            }
            if (value.username != '' && value.username != undefined) {
                    registroAcademico(registroAcademicoInput) 
                    nombre(value.username)   
                    iniciar(true)
                    localStorage.setItem('sessionToken', true);
                    localStorage.setItem('registroToken', registroAcademicoInput);
                    localStorage.setItem('nombreToken', value.username);
                }
              
        })
    }
    async function iniciarSesion(url = '', data = {}) {
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
                <h1>Login</h1>
                    {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
                    <label>Registro Academico</label>
                    <input type="number" id="registroInput" placeholder="Ingrese su Registro Academico" required/>
                    <label>Contraseña</label>
                    <input type="password" id="passwdInput" placeholder="Ingrese Contraseña" required/>
                    <button type="submit">Ingresar</button>
                </form>
                <Link to="/registro" >No Tienes una cuenta? Registrate</Link>
        </div>
    )
}
export default Login