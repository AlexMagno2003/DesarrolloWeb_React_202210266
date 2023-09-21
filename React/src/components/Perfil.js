import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import $ from 'jquery';

function Perfil({ usuarioActual, esMiPerfil }) {
  const [perfilUsuario, setPerfilUsuario] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoApellido, setNuevoApellido] = useState('');
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [nuevoContrasena, setNuevoContrasena] = useState('');
  const [miCuenta, setMiCuenta] = useState('');
  const [error, setError] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false); // Estado para controlar el modo de edición
  const [perfilEditado, setPerfilEditado] = useState({}); // Estado para los valores editados
  const [errorResponse, setErrorResponse] = useState('');

  const { usuario } = useParams();

  useEffect(() => {
    fetchPerfil();
    const registroToken = localStorage.getItem('registroToken');
    if (registroToken == usuario) {
      setMiCuenta(true);
    }
  }, []);

  const fetchPerfil = () => {
    $.ajax({
      url: `http://localhost:4000/buscarPerfil?usuario=${usuario}`,
      method: 'GET',
      dataType: 'json',
      success: (data) => {
        setPerfilUsuario(data);
        setPerfilEditado(data); // Establecer los valores editados inicialmente
      },
      error: (error) => console.error('Error al obtener el usuario:', error),
    });
  };

  const handleEditarPerfil = () => {
    setModoEdicion(true); // Habilitar el modo de edición
  };

  const handleGuardarCambios = async() => {
      setModoEdicion(false);
      const nuevoUsuario = {
      registro_academico: usuario,
      email: nuevoEmail,
      nombre: nuevoNombre,
      apellidos: nuevoApellido,
      contrasena: nuevoContrasena
    };

    const response = await updateUsuario('http://localhost:4000/actualizarPerfil', nuevoUsuario);
    if (response.error) {
          setErrorResponse(response.error);
        } else {
        console.log('Usuario registrado con éxito');
        
    window.location.reload();
        }
    };
    
 async function updateUsuario(url = '', data = {}) {
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
      <h1>Página de perfil de {usuario}</h1>
      {perfilUsuario.map((perfilUsuario) => (
        <div key={perfilUsuario.registro_academico} className="card-publicacion">
          {modoEdicion ? ( // Mostrar el formulario de edición si el modo de edición está habilitado
            <form>
              <label>Nombre:</label>
              <input
              type="text"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
            />
              <label>Apellido:</label>
              <input
              type="text"
              value={nuevoApellido}
              onChange={(e) => setNuevoApellido(e.target.value)}
            />
              <label>Correo Electrónico:</label>
              <input
              type="text"
              value={nuevoEmail}
              onChange={(e) => setNuevoEmail(e.target.value)}
            />
              <label>Contraseña:</label>
              <input
              type="text"
              value={nuevoContrasena}
              onChange={(e) => setNuevoContrasena(e.target.value)}
            />
              <button type="button" onClick={handleGuardarCambios}>
                Guardar Cambios
              </button>
            </form>
          ) : (
            // Mostrar la información del perfil si no está en modo de edición
            <>
              <p>Nombre: {perfilUsuario.nombre}</p>
              <p>Apellido: {perfilUsuario.apellidos}</p>
              <p>Correo Electrónico: {perfilUsuario.email}</p>
              {miCuenta && (
                <button onClick={handleEditarPerfil}>Editar Perfil</button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Perfil;
