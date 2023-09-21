import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Navigate, useNavigate } from "react-router-dom";
import CrearPublicacionModal from './CrearPublicacionModal';
import $ from 'jquery';


function Home({ usuario, registroAcademico }) {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [catedraticos, setCatedraticos] = useState([]);
  const [perfilSeleccionado, setPerfilSeleccionado] = useState('');
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [catedraticoSeleccionado, setCatedraticoSeleccionado] = useState('');
  const [comentarioInput, setComentarioInput] = useState('');
  const [errorResponse, setErrorResponse] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const goTo = useNavigate();
  useEffect(() => {
    // Realiza una solicitud para obtener las publicaciones con comentarios
    fetchPublicaciones();

    // Realiza una solicitud para obtener los cursos y catedráticos
    fetchCursos();
    fetchCatedraticos();
  }, [cursoSeleccionado, catedraticoSeleccionado]);

  const fetchPublicaciones = () => {
    // Realiza la solicitud AJAX para obtener las publicaciones con filtros
    $.ajax({
      url: `http://localhost:4000/publicaciones?curso=${cursoSeleccionado}&catedratico=${catedraticoSeleccionado}`,
      method: 'GET',
      dataType: 'json',
      success: (data) => {
        setPublicaciones(data)},
      error: (error) => console.error('Error al obtener las publicaciones:', error),
    });
  };

  const fetchCursos = () => {
    // Realiza la solicitud AJAX para obtener los cursos
    $.ajax({
      url: 'http://localhost:4000/cursos',
      method: 'GET',
      dataType: 'json',
      success: (data) => setCursos(data),
      error: (error) => console.error('Error al obtener los cursos:', error),
    });
  };

  const fetchCatedraticos = () => {
    // Realiza la solicitud AJAX para obtener los catedráticos
    $.ajax({
      url: 'http://localhost:4000/catedraticos',
      method: 'GET',
      dataType: 'json',
      success: (data) => setCatedraticos(data),
      error: (error) => console.error('Error al obtener los catedráticos:', error),
    });
  };

  const formatearFecha = (fecha) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(fecha).toLocaleDateString(undefined, options);
  };

  const handleLogOut = () => {
    localStorage.removeItem('sessionToken');
    window.location.reload();
  };

  const handleComentarioSubmit = async (publicacionId) => {
    const nuevoComentario = {
      id_publicacion: publicacionId,
      texto: comentarioInput,
    };

    const response = await registrarComentario('http://localhost:4000/registroComentario', nuevoComentario);
    if (response.error) {
      setErrorResponse(response.error);
    } else {
      console.log('Comentario registrado con éxito');
      window.location.reload();
    }
  };

  const registrarComentario = async (url = '', data = {}) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  };

   const handlePerfil = async (perfilSeleccionado) => {
    
    const perfilBuscado = {
      usuario: perfilSeleccionado,
    };

    const response = await buscarPerfil('http://localhost:4000/perfil', perfilBuscado);
    if (response.error) {
      setErrorResponse(response.error);
    } else if (response.username != '' && response.username != undefined) {
      
      console.log(response)
          console.log(perfilSeleccionado);
        goTo(`/perfil/${perfilSeleccionado}`);
        }
    };

  const buscarPerfil = async (url = '', data = {}) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  };
  return (
    <div>
      <div className="header">
  <h1>
    Bienvenido {usuario} {registroAcademico}
  </h1>
  <label>Número de Registro Personal:</label>
  <input
    type="text"
    value={perfilSeleccionado}
    onChange={(e) => setPerfilSeleccionado(e.target.value)}
    placeholder="Ingrese el número de Registro Personal"
    style={{ maxWidth: '350px' }} // Puedes ajustar el ancho máximo según tus preferencias
  />
  <button onClick={() => handlePerfil(perfilSeleccionado)}>Buscar</button>

  <button onClick={handleLogOut}>Cerrar Sesión</button>
</div>

<h2>Publicaciones</h2>
<div className="actions">
  <button onClick={() => setModalIsOpen(true)}>Crear Publicación</button>
  <div className="filter-form">
    <label>Curso:</label>
    <select
      value={cursoSeleccionado}
      onChange={(e) => setCursoSeleccionado(e.target.value)}
      required
    >
      <option value="">Selecciona un curso</option>
      {cursos.map((curso) => (
        <option key={curso.id_curso} value={curso.id_curso}>
          {curso.nombre}
        </option>
      ))}
    </select>
    <label>Catedrático:</label>
    <select
      value={catedraticoSeleccionado}
      onChange={(e) => setCatedraticoSeleccionado(e.target.value)}
      required
    >
      <option value="">Selecciona un catedrático</option>
      {catedraticos.map((catedratico) => (
        <option key={catedratico.id_catedratico} value={catedratico.id_catedratico}>
          {catedratico.nombre}
        </option>
      ))}
    </select>
    <button onClick={fetchPublicaciones}>Filtrar</button>
  </div>
</div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Crear Publicación"
      >
        <CrearPublicacionModal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          registroAcademico={registroAcademico}
          cursos={cursos} // Pasa los cursos obtenidos desde el servidor
          catedraticos={catedraticos} // Pasa los catedráticos obtenidos desde el servidor
        />
      </Modal>
      {publicaciones.length === 0 ? (
        <p>No hay publicaciones con estos cursos o catedráticos.</p>
      ) : (
        publicaciones.map((publicacion) => (
          <div key={publicacion.id_publicacion} className="card-publicacion">
            <h3>
              Autor: {publicacion.nombre_usuario} {publicacion.apellidos_usuario} - {formatearFecha(publicacion.fecha_creacion)}
            </h3>
            {!!publicacion.nombre_curso && <p><strong>Curso:</strong> {publicacion.nombre_curso}</p>}
            {!!publicacion.nombre_catedratico && <p><strong>Catedrático:</strong> {publicacion.nombre_catedratico}</p>}
            <p><strong>Mensaje:</strong> {publicacion.mensaje_publicacion}</p>

            {/* Input para publicar comentarios */}
            <input
              type="text"
              value={comentarioInput}
              onChange={(e) => setComentarioInput(e.target.value)}
              placeholder="Escribe un comentario..."
            />
            <button onClick={() => handleComentarioSubmit(publicacion.id_publicacion)}>Publicar Comentario</button>

            {/* Lista de comentarios */}
            <h3>Comentarios</h3>
            <ol>
              {publicacion.comentarios.map((comentario) => (
                <li key={comentario.id_comentario} className="card-comentario">{comentario.texto}</li>
              ))}
            </ol>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
