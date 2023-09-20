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

function registrarUsuario(registro_academico, email, nombre, apellidos, contrasena) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO users (registro_academico, email, nombre, apellidos, contrasena) VALUES (?, ?, ?, ?, ?)";
    const values = [registro_academico, email, nombre, apellidos, contrasena];

    conn.query(sql, values, function (err, result) {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

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
        res.status(400).send({ error: 'No se encontro el usuario' });
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

app.listen(port, () => { console.log(`escuchando el puerto ${port}`)})