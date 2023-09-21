import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import CrearPublicacionModal from './CrearPublicacionModal';


function Home({ usuario, registroAcademico }) {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [catedraticos, setCatedraticos] = useState([]);
  const [comentarioInput, setComentarioInput] = useState('');
    const [errorResponse, setErrorResponse] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);


  useEffect(() => {
    // Realiza una solicitud para obtener las publicaciones con comentarios
    fetch('http://localhost:4000/publicaciones')
      .then((response) => response.json())
      .then((data) => setPublicaciones(data))
      .catch((error) => console.error('Error al obtener las publicaciones:', error));
  }, []);
    
    useEffect(() => {
    fetch('http://localhost:4000/cursos')
      .then((response) => response.json())
      .then((data) => setCursos(data))
      .catch((error) => console.error('Error al obtener los cursos:', error));
    }, []);
    
    useEffect(() => {
    fetch('http://localhost:4000/catedraticos')
      .then((response) => response.json())
      .then((data) => setCatedraticos(data))
      .catch((error) => console.error('Error al obtener los cursos:', error));
    }, []);


    function formatearFecha(fecha) {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };

    return new Date(fecha).toLocaleDateString(undefined, options);
    }
    
    const handleLogOut = (event) =>
    {
        localStorage.removeItem('sessionToken');
        window.location.reload();
      }
  const handleComentarioSubmit = async (publicacionId) => {
    
    const nuevoComentario = {
      id_publicacion: publicacionId,
      texto: comentarioInput
    };

    const response = await registrarComentario('http://localhost:4000/registroComentario', nuevoComentario);
    if (response.error) {
          setErrorResponse(response.error);
        } else {
          console.log('Comentario registrado con éxito');
            window.location.reload();
        }
    };
    
 async function registrarComentario(url = '', data = {}) {
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
          <h1>Bienvenido {usuario} {registroAcademico}</h1> 
          
          <button onClick={() => handleLogOut()}>Cerrar Sesión</button>
          <h2>Publicaciones</h2>
          <button onClick={() => setModalIsOpen(true)}>Crear Publicación</button>
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
      {publicaciones.map((publicacion) => (
        <div key={publicacion.id_publicacion} className="card-publicacion"> 
          <h3>
            Autor: {publicacion.nombre_usuario} {publicacion.apellidos_usuario} - {formatearFecha(publicacion.fecha_creacion)}
          </h3>
          {!!publicacion.nombre_curso && <p><strong>Curso:</strong>  {publicacion.nombre_curso}</p>}
          {!!publicacion.nombre_catedratico && <p><strong>Catedrático:</strong>  {publicacion.nombre_catedratico}</p>}
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
      ))}
    </div>
  );
}

export default Home;
