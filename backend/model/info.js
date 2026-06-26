//Importaciones
import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import pool from "../database/index.js";

//Aplicación y puerto
const app = express();
const port = 5000;

//Restricciones
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: true, // Permite que cualquier IP conecte
    credentials: true, // Necesario para que combine con axios.defaults.withCredentials = true
  }),
);

//Datos de sesión
app.use(
  session({
    secret: "secreto",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

//Funciones de sesión
//Registrar
app.post("/account/register", async (req, res) => {
  try {
    const { nombre, apellidos, correo, contra } = req.body;
    const fecha = new Date().toISOString().split("T")[0]; //De nuevo, ¿Para qué?
    const contraHash = await bcrypt.hash(contra, 10);
    console.log(
      "Datos de registro: ",
      nombre,
      apellidos,
      correo,
      contraHash,
      fecha,
    );
    const sql =
      "INSERT INTO alumnos (nombre, apellidos, correo, contrasena, fecha) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
    const result = await pool.query(sql, [
      nombre,
      apellidos,
      correo,
      contraHash,
      fecha,
    ]);
    console.log(result);

    const sql2 =
      "SELECT id_alumno, nombre, apellidos, correo FROM alumnos where correo = $1";
    const usuarioResult = await pool.query(sql2, [correo]);
    const usuario = usuarioResult.rows[0];
    req.session.usuario = {
      id: usuario.id_alumno,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      correo: usuario.correo,
    };

    return res.status(201).send(result.rows || result);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: err.message || err });
  }
});

//Login
app.post("/account/login", async (req, res) => {
  try {
    const { correo, contra } = req.body;
    const sql = "SELECT * FROM alumnos WHERE correo = $1;";
    const result = await pool.query(sql, [correo]);

    console.log(correo, contra);
    if (result.rows.length === 0) {
      console.error("Usuario no encontrado");
      return res.status(404).send("Usuario no encontrado");
    }

    const usuario = result.rows[0];
    const ver = await bcrypt.compare(contra, usuario.contrasena);

    if (!ver) {
      console.error("La contraseña es incorrecta");
      return res.status(401).send("La contraseña es incorrecta");
    }

    // Guardar datos en la sesión
    req.session.usuario = {
      id: usuario.id_alumno,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      correo: usuario.correo,
    };

    console.log("Usuario autenticado:", usuario);

    return res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      id: usuario.id_alumno,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      correo: usuario.correo,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: err.message || err });
  }
});

//Cerrar sesión
app.get("/account/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send(`No se pudo cerrar la sesión: ${err.message || err}`);
    } else {
      console.log("Sesión cerrada");
      return res.status(200).send("Sesión cerrada");
    }
  });
});

//Cambiar la contraseña
app.put("/account/update-password/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { contra, newcontra } = req.body;
    if (contra.trim() && newcontra.trim()) {
      const sql = "SELECT * FROM alumnos WHERE id_alumno = $1;";
      const result = await pool.query(sql, [id]);
      if (result.rows.length == 0) {
        console.error("Usuario no encontrado");
        return res.status(404).send("Alumno no existe");
      } else {
        const alumno = result.rows[0];
        const ver = await bcrypt.compare(contra, alumno.contrasena);
        if (!ver) {
          console.error("Contraseña incorrecta");
          return res.status(400).send("La contraseña es incorrecta");
        } else {
          const contraHash = await bcrypt.hash(newcontra, 10);
          const sql = "UPDATE alumnos SET contrasena = $1 WHERE id_alumno = $2";
          const updateRes = await pool.query(sql, [contraHash, id]);
          console.info({ updateRes });
          return res.status(201).send("Contraseña cambiada con éxito");
        }
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: err.message || err });
  }
});

//Borrar cuenta
app.delete("/account/delete/:id", async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM alumnos WHERE id_alumno = $1;";
  try {
    await pool.query(sql, [id]);
    return res.send("Cuenta borrada");
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

//Pedir datos de la sesión
app.get("/account/me", (req, res) => {
  if (!req.session.usuario) {
    return res
      .status(401)
      .send({ loggedIn: false, error: "Acceso no autorizado" });
  } else {
    return res.json({ loggedIn: true, usuario: req.session.usuario });
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
    const sql = "SELECT * FROM registro_diario;";
    const { rows } = await pool.query(sql);
    return res.status(200).send({ result: rows });
  } catch (err) {
    return res.status(500).send({ error: err.message || err });
  }
});

//Inserción de los datos de una sola vez
app.post("/general/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      edad,
      sexo,
      carrera,
      instituto,
      fecha,
      n_insc,
      burnout,
      actividad,
      psiquia,
      psico,
    } = req.body;
    const existe = await pool.query(
      `SELECT 1
        FROM encuesta_general
        WHERE id_alumno = $1`,
      [id],
    );
    if (existe.rows.length > 0) {
      return res.status(409).json({
        error: "La encuesta general ya fue respondida",
      });
    } else {
      if (
        !Number.isFinite(edad) ||
        !sexo.trim() ||
        !carrera.trim() ||
        !instituto.trim() ||
        !Number.isFinite(Number(n_insc)) ||
        typeof burnout !== "boolean" ||
        typeof actividad !== "boolean" ||
        typeof psiquia !== "boolean" ||
        typeof psico !== "boolean"
      ) {
        console.log(
          Number(edad),
          sexo,
          carrera,
          instituto,
          Date(fecha),
          Number(n_insc),
          burnout,
          actividad,
          psiquia,
          psico,
        );
        return res.status(400).send({
          error:
            "No se han insertado los datos correspondientes, inténtelo de nuevo",
        });
      } else {
        // const result = await pool.query(sql, [ide, edad, sexo, carrera, instituto, fecha, n_insc, burnout, actividad, psiquia, psico, id]);
        const sql =
          "INSERT INTO encuesta_general (edad, sexo, carrera, institucion, fecha, n_inscripcion, burnout_previo, actividad_f, tratamiento_psiquia, tratamiento_psico, id_alumno) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);";
        const result = await pool.query(sql, [
          edad,
          sexo,
          carrera,
          instituto,
          fecha,
          n_insc,
          burnout,
          actividad,
          psiquia,
          psico,
          id,
        ]);
        return res.status(201).send({ result });
      }
    }
  } catch (err) {
    console.error(err.message || err);
    return res.status(500).send({ error: err.message || err });
  }
}); //¿Le metieron mano al backend mientras no estaba? Ya funcionaba antes qué pasó .-.

//Inserción de datos de la encuesta
app.post("/registros/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      h_sueno,
      cal_sueno,
      n_comidas,
      hor_comidas,
      cal_consumo,
      h_osio,
      cal_consumo_tec,
      uso_ia,
      aplicacion,
      pregunta_objetivo,
    } = req.body;
    const fecha = new Date().toISOString().split("T")[0];
    const existe = await pool.query(
      `SELECT 1
        FROM registro_diario
        WHERE id_alumno = $1
        AND fecha = CURRENT_DATE `,
      [id],
    );
    if (existe.rows.length > 0) {
      return res.status(409).json({
        error: "Ya existe un registro para hoy",
      });
    } else {
      if (
        !Number.isFinite(Number(h_sueno)) ||
        !Number.isFinite(Number(cal_sueno)) ||
        !Number.isFinite(Number(n_comidas)) ||
        !hor_comidas?.trim() ||
        !Number.isFinite(Number(cal_consumo)) ||
        !Number.isFinite(Number(h_osio)) ||
        !Number.isFinite(Number(cal_consumo_tec)) ||
        typeof uso_ia !== "boolean" ||
        !aplicacion?.trim() ||
        !Number.isFinite(Number(pregunta_objetivo))
      ) {
        console.log(
          id,
          h_sueno,
          cal_sueno,
          n_comidas,
          hor_comidas,
          cal_consumo,
          h_osio,
          cal_consumo_tec,
          uso_ia,
          aplicacion,
          pregunta_objetivo,
        );
        return res
          .status(400)
          .send({ error: "No se han insertado los datos correspondientes" });
      } else {
        const sql =
          "INSERT INTO registro_diario (fecha, h_sueno, cal_sueno, n_comidas, hor_comidas, cal_consumo, h_osio, cal_consumo_tec, uso_ia, aplicacion, pregunta_objetivo, id_alumno) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);";
        const result = await pool.query(sql, [
          fecha,
          Number(h_sueno),
          Number(cal_sueno),
          Number(n_comidas),
          hor_comidas,
          Number(cal_consumo),
          Number(h_osio),
          Number(cal_consumo_tec),
          uso_ia,
          aplicacion,
          Number(pregunta_objetivo),
          id,
        ]);
        return res.status(201).send({ result });
      }
    }
  } catch (err) {
    console.error(err.message || err);
    return res.status(500).send({ error: err.message || err });
  }
});

//Búsqueda de datos por alumno
app.get("/registros/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM registro_diario WHERE id_alumno = $1;";
    const { rows } = await pool.query(sql, [id]);
    return res.status(200).send({ result: rows });
  } catch (err) {
    return res.status(500).send({ error: err.message || err });
  }
});

//El resto de cosas
app.all("/*splat", (req, res) => {
  return res.status(404).send({ mensaje: "La ruta no existe" });
});

//El escuchar
app.listen(port, "0.0.0.0", () => {
  console.log(`Tablos controla el servidor en puerto ${port}`);
});

// Manejo de errores no capturados
process.on("uncaughtException", (err) => {
  console.error("Error no capturado:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Promise rechazada no manejada:", reason);
});
