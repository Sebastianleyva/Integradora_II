//importaciones a usar
import { v4 as uuid } from "uuid";
import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import pool from "../database/index.js"

//puertos
const app = express();
const port = 5000;

//Restricciones
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

//Datos de sesión
app.use(session({
    secret: "secreto",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

//Funciones de sesión
//Registrar
app.post("/account/register", async (req, res) => {
    try {
        const {nombre, apellidos, correo, contra} = req.body;
        const fecha = new Date();
        const ide = uuid();
        const contraHash = await bcrypt.hash(contra, 10);
        console.log("Datos de registro: ", ide, nombre, apellidos, correo, contraHash, fecha);
        const sql = "INSERT INTO alumnos (id_alumno, nombre, apellidos, correo, contrasena, fecha) VALUES ($1, $2, $3, $4, $5, $6)";
        const result = await pool.query(sql, [ide, nombre, apellidos, correo, contraHash, fecha]);
        console.log(result);
        return res.status(201).send(result.rows || result);
    } catch (err) {
        console.error(err);
        return res.status(500).send({error: err.message || err});
    }
});

//Login
app.post("/account/login", async (req, res) => {
    const {correo, contra} = req.body;
    const sql = "SELECT * FROM alumnos WHERE correo = $1";
    try {
        const result = await pool.query(sql, [correo]);
        if (result.rows.length === 0) {
            console.error("Usuario no encontrado");
            return res.status(404).send("Alumno no encontrado");
        }

        const usuario = result.rows[0];
        const ver = await bcrypt.compare(contra, usuario.contrasena);
        if (!ver) {
            console.error("La contraseña es incorrecta");
            return res.status(400).send("Contraseña incorrecta");
        } else {
            req.session.usuario = {
                id: usuario.id_alumno,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                correo: usuario.correo
            };
            console.log(usuario);
            return res.status(200).send("Inicio de sesión exitoso");
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({error: err.message || err});
    }
});

//Cerrar sesión
app.get("/account/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send(`No se pudo cerrar la sesión: ${err.message || err}`);
        } else {
            console.log("Sesión cerrada");
            return res.status(200).send("Sesión cerrada");
        }
    });
});

//Borrar cuenta
app.delete("/account/delete/:id", async (req, res) => {
    const {id} = req.params;
    const sql = "DELETE FROM alumnos WHERE id_alumno = $1";
    try {
        await pool.query(sql, [id]);
        return res.send("Cuenta borrada");
    } catch (err) {
        console.error(err);
        return res.status(500).send(err);
    }
});

//Funciones de base de datos
//Endpoint inicial
app.get("/", (req, res) => {
    res.send("Este es el inicio de la base de datos");
});

//Función general
app.get("/registros", async (req, res) => {
    try {
        const sql = "SELECT * FROM alumnos";
        const { rows } = await pool.query(sql);
        return res.status(200).send({ result:rows, });
    } catch (err) {
        return res.status(500).send({error:err.message || err})
    }
});

//El resto de cosas
app.all("/*splat", (req,res) => {
    return res.status(404).send({mensaje:"La ruta no existe"})
});

//El escuchar
app.listen(port, () => {
  console.log(`Tablos controla el servidor en puerto ${port}`);
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  console.error('Error no capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rechazada no manejada:', reason);
});