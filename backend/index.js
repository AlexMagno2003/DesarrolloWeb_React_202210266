const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = 4000;

app.use(express.json())
app.use(cors())
app.get("/", (req, res) => (res.json({ message: "ok" })));

let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'react_login_app'
})

conn.connect(function (err) { if (err) throw err; console.log('conexion exitosa') });
function buscarUsuario(usuario, contra) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT nombre FROM users WHERE registro_academico=? AND  contrasena =?`, [usuario, contra], function (err, result) {
            if (err) return reject(err);
            if (result[0]) {
                let resultado = JSON.stringify(result[0]);
                let jresultado = JSON.parse(resultado);
                return resolve(jresultado)
            } else {
                return resolve(null)
            }
        })
    })
}

function buscarPerfilHome(usuario) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT registro_academico FROM users WHERE registro_academico=? `, [usuario], function (err, result) {
            if (err) return reject(err);
            if (result[0]) {
                let resultado = JSON.stringify(result[0]);
              let jresultado = JSON.parse(resultado);
              console.log(jresultado)
                return resolve(jresultado)
            } else {
                return resolve(null)
            }
        })
    })
}

function registrarUsuario(registro_academico, email, nombre, apellidos, contrasena) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO users (registro_academico, email, nombre, apellidos, contrasena) VALUES (?, ?, ?, ?, ?)";
    const values = [registro_academico, email, nombre, apellidos, contrasena];

    conn.query(sql, values, function (err, result) {
      if (err) return reject(err);
      resolve(result);
      console.log(result)
    });
  });
}
const moment = require('moment-timezone');
function registrarPublicacion(registro_usuario, id_curso, id_catedratico, mensaje_publicacion) {
  return new Promise((resolve, reject) => {
    const fechaActual = moment().tz('America/Guatemala');
    
    // Obtener la fecha actual en la zona horaria local
    const fechaFormateada = fechaActual.format('YYYY-MM-DD HH:mm:ss');

    const sql = "INSERT INTO Publicaciones (registro_usuario, id_curso, id_catedratico, mensaje_publicacion, fecha_creacion) VALUES (?, ?, ?, ?, ?)";
    const values = [registro_usuario, id_curso, id_catedratico, mensaje_publicacion, fechaFormateada];

    conn.query(sql, values, function (err, result) {
      if (err) return reject(err);
      resolve(result);
      console.log(result)
    });
  });
}

function registrarComentario(id_publicacion, texto) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO comentarios (id_publicacion, texto) VALUES (?, ?)";
    const values = [id_publicacion, texto];

    conn.query(sql, values, function (err, result) {
      if (err) return reject(err);
      resolve(result);
      console.log(result)
    });
  });
}

function obtenerPublicacionesConComentarios(cursoSeleccionado, catedraticoSeleccionado) {
  return new Promise((resolve, reject) => {
    let sql = `
      SELECT
        p.id_publicacion,
        u.nombre AS nombre_usuario,
        u.apellidos AS apellidos_usuario,
        p.id_curso,
        c.nombre AS nombre_curso,
        p.id_catedratico,
        cat.nombre AS nombre_catedratico,
        p.mensaje_publicacion,
        p.fecha_creacion,
        co.id_comentario,
        co.texto
      FROM Publicaciones p
      LEFT JOIN users u ON p.registro_usuario = u.registro_academico
      LEFT JOIN catedraticos cat ON p.id_catedratico = cat.id_catedratico
      LEFT JOIN cursos c ON p.id_curso = c.id_curso
      LEFT JOIN comentarios co ON p.id_publicacion = co.id_publicacion
    `;

    // Agregar condiciones de filtrado si se selecciona un curso o un catedrático
     if (cursoSeleccionado && catedraticoSeleccionado) {
      sql += ` WHERE p.id_curso = ${cursoSeleccionado} AND p.id_catedratico = ${catedraticoSeleccionado}`;
    } else if (cursoSeleccionado) {
      sql += ` WHERE p.id_curso = ${cursoSeleccionado}`;
    } else if (catedraticoSeleccionado) {
      sql += ` WHERE p.id_catedratico = ${catedraticoSeleccionado}`;
    }

    conn.query(sql, (err, results) => {
      if (err) return reject(err);

      // Organiza los resultados en una estructura de datos adecuada
      const publicacionesConComentarios = {};
      results.forEach((row) => {
        const idPublicacion = row.id_publicacion;
        if (!publicacionesConComentarios[idPublicacion]) {
          publicacionesConComentarios[idPublicacion] = {
            id_publicacion: idPublicacion,
            nombre_usuario: row.nombre_usuario,
            apellidos_usuario: row.apellidos_usuario,
            nombre_curso: row.nombre_curso,
            nombre_catedratico: row.nombre_catedratico,
            mensaje_publicacion: row.mensaje_publicacion,
            fecha_creacion: row.fecha_creacion,
            comentarios: [],
          };
        }
        if (row.id_comentario) {
          publicacionesConComentarios[idPublicacion].comentarios.push({
            id_comentario: row.id_comentario,
            texto: row.texto,
          });
        }
      });

      const publicaciones = Object.values(publicacionesConComentarios);

      // Verificar si no hay coincidencias y devolver un mensaje
      if (publicaciones.length === 0) {
        resolve(publicaciones);
      } else {
        resolve(publicaciones);
      }
    });
  });
}


// Función para obtener todos los ID y nombres de cursos
function obtenerCursos() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id_curso, nombre FROM cursos";

    conn.query(sql, (err, results) => {
      if (err) return reject(err);
      const cursos = Object.values(results);
      resolve(cursos);
    });
  });
}

// Función para obtener todos los ID y nombres de catedráticos
function obtenerCatedraticos() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id_catedratico, nombre FROM catedraticos";

    conn.query(sql, (err, results) => {
      if (err) return reject(err);
      const catedraticos = Object.values(results);
      resolve(catedraticos);
    });
  });
}

function buscarPerfil(usuario) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT registro_academico, email, contrasena, nombre, apellidos FROM users WHERE registro_academico=? `, [usuario], function (err, result) {
            if (err) return reject(err);
          if (result) {
              const perfil = {};
      result.forEach((row) => {
          perfil[0] = {
            registro_academico: row.registro_academico,
            email: row.email,
            contrasena: row.contrasena,
            nombre: row.nombre,
            apellidos: row.apellidos,
          };
      });
            const perfilBuscado = Object.values(perfil);
            return resolve(perfilBuscado)
            } else {
                return resolve(perfil)
            }
        })
    })
}

app.get("/buscarPerfil", async (req, res) => {
  try {
    const { usuario } = req.query;
    const perfil = await buscarPerfil(usuario);
    res.status(200).json(perfil);
  } catch (error) {
    console.error('Error al obtener las publicaciones:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});
// Ruta para obtener todos los cursos
app.get("/cursos", async (req, res) => {
  try {
    const cursos = await obtenerCursos();
    res.status(200).json(cursos);
  } catch (error) {
    console.error('Error al obtener los cursos:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

// Ruta para obtener todos los catedráticos
app.get("/catedraticos", async (req, res) => {
  try {
    const catedraticos = await obtenerCatedraticos();
    res.status(200).json(catedraticos);
  } catch (error) {
    console.error('Error al obtener los catedráticos:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});


// Ruta para obtener todas las publicaciones con comentarios
app.get("/publicaciones", async (req, res) => {
  try {
    const { curso, catedratico } = req.query;
    const publicaciones = await obtenerPublicacionesConComentarios(curso, catedratico);
    res.status(200).json(publicaciones);
  } catch (error) {
    console.error('Error al obtener las publicaciones:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

// Agrega una ruta para actualizar el perfil de usuario
app.post('/actualizarPerfil', async (req, res) => {
  try {
    const { registro_academico, email, nombre, apellidos, contrasena } = req.body;
    
    // Realiza la actualización en la base de datos
    conn.query(
      'UPDATE users SET email = ?, nombre = ?, apellidos = ?, contrasena = ? WHERE registro_academico = ?',
      [email, nombre, apellidos, contrasena, registro_academico],
      (err, result) => {
        if (err) {
          console.error('Error al actualizar el perfil:', err);
          res.status(500).send({ error: 'Error interno del servidor' });
        } else {
          console.log('Perfil actualizado con éxito');
          res.status(200).send({ message: 'Perfil actualizado con éxito' });
        }
      }
    );
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

app.post("/login", async (req, res) => {
    const { usuario, contra } = req.body;
    
    // if (usuario != lusuario) res.status(400).send({ error: 'usuario incorrecto' });
    // if (contra != lcontra) res.status(400).send({ error: 'contraseña incorrecto' });
    if (!usuario || !contra) {
        res.status(400).send({ error: 'faltan campos' });
    }
    const resultado = await buscarUsuario(usuario, contra);
    if (resultado) {
        res.send({username: resultado.nombre})
    }
    else {
        res.status(400).send({ error: 'Registro Académico o Contraseña incorrectas' });
    }
})

app.post("/perfil", async (req, res) => {
    const { usuario } = req.body;
    
    // if (usuario != lusuario) res.status(400).send({ error: 'usuario incorrecto' });
    // if (contra != lcontra) res.status(400).send({ error: 'contraseña incorrecto' });
    if (!usuario) {
        res.status(400).send({ error: 'faltan campos' });
    }
    const resultado = await buscarPerfilHome(usuario);
    if (resultado) {
        res.send({username: resultado.registro_academico})
    }
    else {
        res.status(400).send({ error: 'No existe el Registro Académico' });
    }
})

app.post("/registro", async (req, res) => {
  const { registro_academico, email, nombre, apellidos, contrasena } = req.body;

  if (!registro_academico || !email || !nombre || !apellidos || !contrasena) {
    res.status(400).send({ error: 'Faltan campos obligatorios' });
    return;
  }

  try {
    const result = await registrarUsuario(registro_academico, email, nombre, apellidos, contrasena);
    console.log('Usuario registrado con éxito');
    res.status(200).send({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send({ error: 'El registro academico ya fue registrado' });
  }
});

app.post("/registroPublicacion", async (req, res) => {
  const { registro_usuario, id_curso, id_catedratico, mensaje_publicacion } = req.body;

  if (!registro_usuario || !id_curso || !id_catedratico || !mensaje_publicacion) {
    res.status(400).send({ error: 'Faltan campos obligatorios' });
    return;
  }

  try {
    const result = await registrarPublicacion(registro_usuario, id_curso, id_catedratico, mensaje_publicacion);
    console.log('Publicacion registrada con éxito');
    res.status(200).send({ message: 'Publicacion registrada con éxito' });
  } catch (error) {
    console.error('Error al registrar Publicacion:', error);
    res.status(500).send({ error: 'Error del servidor' });
  }
});

app.post("/registroComentario", async (req, res) => {
  const { id_publicacion, texto} = req.body;

  if (!id_publicacion || !texto ) {
    res.status(400).send({ error: 'Faltan campos obligatorios' });
    return;
  }

  try {
    const result = await registrarComentario(id_publicacion, texto);
    console.log('Comentario registrado con éxito');
    res.status(200).send({ message: 'Comentario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar el Comentario:', error);
    res.status(500).send({ error: 'Error del servidor' });
  }
});

app.listen(port, () => { console.log(`escuchando el puerto ${port}`)})