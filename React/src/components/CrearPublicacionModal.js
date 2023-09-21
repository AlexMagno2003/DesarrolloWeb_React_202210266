import React, { useState } from 'react';
import Modal from 'react-modal';

const CrearPublicacionModal = ({ isOpen, onRequestClose, cursos, catedraticos, registroAcademico }) => {
  const [cursoSeleccionado, setCursoSeleccionado] = useState('');
  const [catedraticoSeleccionado, setCatedraticoSeleccionado] = useState('');
  const [mensaje, setMensaje] = useState('');
    const [errorResponse, setErrorResponse] = useState("");

  const handleCrearPublicacion = async () => {
    
    const nuevaPublicacion = {
      registro_usuario: registroAcademico,
      id_curso: cursoSeleccionado,
      id_catedratico: catedraticoSeleccionado,
      mensaje_publicacion: mensaje
    };

    const response = await registrarPublicacion('http://localhost:4000/registroPublicacion', nuevaPublicacion);
    if (response.error) {
          setErrorResponse(response.error);
        } else {
          console.log('PUblicacion registrada con éxito');
            window.location.reload();
        }
    };
    
 async function registrarPublicacion(url = '', data = {}) {
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
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Crear Publicación"
    >
      <h2>Crear Publicación</h2>
      <form class="form">
        <div>
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
        </div>
        <div>
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
        </div>
        <div>
          <label>Mensaje:</label>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            rows="4"
            cols="50"
            placeholder="Escribe tu mensaje aquí..."
          />
        </div>
        <button onClick={handleCrearPublicacion}>Crear Publicación</button>
      </form>
    </Modal>
  );
};

export default CrearPublicacionModal;
