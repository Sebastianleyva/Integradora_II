//Importaciones
import express from "express";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import session from "express-session";
import pool from "../database/index.js";
import "dotenv/config.js";

const router = express.Router();

//Datos de sesión
router.use(
  session({
    secret: process.env.SESSION_SECRET || "secreto",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

//Funciones de sesión
//Registrar
router.post("/account/register", async (req, res, next) => {
  try {
    const { nombre, apellidos, correo, contra } = req.body;
    const ver = "SELECT * FROM login_cred($1);";
    const exist = await pool.query(ver, [correo]);
    if (exist.rows.length > 0) {
      return res.status(409).json({
        message:
          "Este correo ya esta registrado. Intenta con otro correo o inicia sesion si es tu cuenta.",
      });
    }
    const fecha = new Date().toISOString().split("T")[0];
    const contraHash = await bcrypt.hash(contra, 10);
    console.log(
      "Datos de registro: ",
      nombre,
      apellidos,
      correo,
      contraHash,
      fecha,
    );
    const sql = "SELECT * FROM register($1, $2, $3, $4, $5);";

    const usuario = await pool.query(sql, [
      nombre,
      apellidos,
      correo,
      contraHash,
      fecha,
    ]);
    console.log(usuario);
    if (!usuario || usuario.rows.length == 0) {
      throw new Error();
    }

    /*
    req.session.usuario = {
      id: usuario.rows[0].id_alumno,
      nombre: usuario.rows[0].nombre,
      apellidos: usuario.rows[0].apellidos,
      correo: usuario.rows[0].correo,
    };
    */
    const usuarioData = usuario.rows[0];
    const token = jwt.sign(
      {
        id: usuarioData.id_alumno,
        nombre: usuarioData.nombre,
        apellidos: usuarioData.apellidos,
        correo: usuarioData.correo,
      },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "1d" },
    );

    return res.status(201).json({
      message:
        "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.",
      result: usuario.rows || usuario,
      token
    });
  } catch (err) {
    next(err);
  }
});

//Valida el registro diario antes de poder entrar en el
router.get("/registros/:id/existe-hoy", async (req, res, next) => {
  try {
    const { id } = req.params;
    const existe = await pool.query("SELECT * FROM verified($1)", [id]);
    return res.json({
      existe: existe.rows.length > 0,
    });
  } catch (err) {
    next(err);
  }
});

//tarjetas para el historial
router.get("/registros/:id/recientes", async (req, res, next) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT
        id_registro,
        fecha,
        h_sueno,
        n_comidas,
        h_osio
      FROM registro_diario
      WHERE id_alumno = $1
        AND fecha < CURRENT_DATE
      ORDER BY fecha DESC;
    `;

    const { rows } = await pool.query(sql, [id]);

    const historial = rows.map((registro_diario) => ({
      id: registro_diario.id_registro,
      fecha: new Date(registro_diario.fecha).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
      }),
      horasSueno: `${registro_diario.h_sueno} h`,
      comidas: registro_diario.n_comidas,
      horasTecnologia: `${registro_diario.h_osio} h`,
    }));

    res.json(historial);
  } catch (error) {
    next(error);
  }
});

//Login
router.post("/account/login", async (req, res, next) => {
  try {
    const { correo, contra } = req.body;
    const sql = "SELECT * FROM login_cred($1);";
    const result = await pool.query(sql, [correo]);

    console.log(correo, contra);
    if (result.rows.length === 0) {
      console.error("Usuario no encontrado");
      return res.status(404).json({
        message:
          "No existe una cuenta con este correo. ¿Quizas querías registrarte?",
      });
    }

    const usuario = result.rows[0];
    const ver = await bcrypt.compare(contra, usuario.contrasena);

    if (!ver) {
      console.error("La contraseña es incorrecta");
      return res.status(401).json({
        message:
          "La contraseña es incorrecta, Verifica tus datos e intenta de nuevo.",
      });
    }

    // Guardar datos en la sesión
    /*
    req.session.usuario = {
      id: usuario.id_alumno,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      correo: usuario.correo,
    };
    */
    const usuarioData = usuario.rows[0];
    const token = jwt.sign(
      {
        id: usuarioData.id_alumno,
        nombre: usuarioData.nombre,
        apellidos: usuarioData.apellidos,
        correo: usuarioData.correo,
      },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "1d" },
    );

    console.log("Usuario autenticado:", token);

    return res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      usuario: {
        id: usuario.id_alumno,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
      },
      token
    });
  } catch (err) {
    next(err);
  }
});

//Cerrar sesión
router.get("/account/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err)
    }

    console.log("Sesión cerrada");
    return res.status(200).send("Sesión cerrada");
  });
});

//Cambiar la contraseña
router.put("/account/update-password/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { contra, newcontra } = req.body;
    if (contra.trim() && newcontra.trim()) {
      const sql = "SELECT * FROM alumno($1);";
      const result = await pool.query(sql, [id]);
      if (result.rows.length == 0) {
        console.error("Usuario no encontrado");
        return res
          .status(404)
          .json({ message: "No hay una sección activa disponible" });
      } else {
        const alumno = result.rows[0];
        const ver = await bcrypt.compare(contra, alumno.contrasena);
        if (!ver) {
          console.error("Contraseña incorrecta");
          return res
            .status(401)
            .json({ message: "La contraseña es incorrecta" });
        } else {
          const contraHash = await bcrypt.hash(newcontra, 10);
          const sql2 = "CALL pass_change($1, $2)";
          const updateRes = await pool.query(sql2, [id, contraHash]);
          console.info({ updateRes });
          return res
            .status(200)
            .json({ message: "Contraseña cambiada con éxito" });
        }
      }
    } else {
      return res
        .status(400)
        .json({ message: "Introduce las contraseñas correspondientes" });
    }
  } catch (err) {
    next(err);
  }
});

//Borrar cuenta
router.delete("/account/delete/:id", async (req, res, next) => {
  const { id } = req.params;
  const sql = "DELETE FROM alumnos WHERE id_alumno = $1;";
  try {
    await pool.query(sql, [id]);
    return res.send("Cuenta borrada");
  } catch (err) {
    next(err);
  }
});

//Pedir datos de la sesión
router.get("/account/me", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ loggedIn: false, error: "Acceso no autorizado" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const usuario = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    return res.json({ loggedIn: true, usuario });
  } catch (err) {
    return res
      .status(401)
      .json({ loggedIn: false, error: "Acceso no autorizado" });
  }
});

//Funciones de base de datos
//Endpoint inicial
router.get("/", (req, res) => {
  res.send("Este es el inicio de la base de datos");
});

//Función general
router.get("/registros", async (req, res, next) => {
  try {
    const sql = "SELECT * FROM registro_diario;";
    const { rows } = await pool.query(sql);
    return res.status(200).send({ result: rows });
  } catch (err) {
    next(err);
  }
});

//Inserción de los datos de una sola vez
router.post("/general/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      edad,
      sexo,
      carrera,
      n_insc,
      burnout,
      actividad,
      psiquia,
      psico,
      work,
    } = req.body;
    if (
      !Number.isFinite(edad) ||
      !sexo.trim() ||
      !carrera.trim() ||
      !Number.isFinite(Number(n_insc)) ||
      typeof burnout !== "boolean" ||
      typeof actividad !== "boolean" ||
      typeof psiquia !== "boolean" ||
      typeof psico !== "boolean" ||
      typeof work !== "boolean"
    ) {
      console.log(
        Number(edad),
        sexo,
        carrera,
        Number(n_insc),
        burnout,
        actividad,
        psiquia,
        psico,
        work,
      );
      return res.status(400).send({
        error:
          "No se han insertado los datos correspondientes, inténtelo de nuevo",
      });
    } else {
      // const result = await pool.query(sql, [ide, edad, sexo, carrera, instituto, fecha, n_insc, burnout, actividad, psiquia, psico, id]);
      const sql =
        "SELECT * FROM general_insert($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);";
      const result = await pool.query(sql, [
        edad,
        sexo,
        carrera,
        n_insc,
        burnout,
        actividad,
        psiquia,
        psico,
        work,
        id,
      ]);
      return res.status(201).send({ result });
    }
  } catch (err) {
    next(err);
  }
});

//Verificación de la encuesta general (por si hay bugs)
router.get("/general/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM registro_vista($1)";
    const result = await pool.query(sql, [id]);
    if (result.rows.length > 0) {
      return res
        .status(200)
        .json({ encuesta: false, message: "Inicio de sesión exitoso" });
    } else {
      return res.status(200).json({
        encuesta: true,
        message:
          "Inicio de sesión logrado, por favor realiza la encuesta general",
      });
    }
  } catch (err) {
    next(err);
  }
});

//Inserción de datos de la encuesta
router.post("/registros/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      h_sueno,
      cal_sueno,
      n_comidas,
      cal_consumo,
      h_osio,
      cal_consumo_tec,
      uso_ia,
      aplicacion,
      pregunta_objetivo,
    } = req.body;
    const fecha = new Date().toISOString().split("T")[0];
    const existe = await pool.query("SELECT * FROM verified($1)", [id]);
    if (existe.rows.length > 0) {
      return res.status(409).json({
        error: "Ya existe un registro para hoy, muchas gracias por responder",
      });
    } else {
      if (
        !Number.isFinite(Number(h_sueno)) ||
        !Number.isFinite(Number(cal_sueno)) ||
        !Number.isFinite(Number(n_comidas)) ||
        !Number.isFinite(Number(cal_consumo)) ||
        !Number.isFinite(Number(h_osio)) ||
        !Number.isFinite(Number(cal_consumo_tec)) ||
        typeof uso_ia !== "boolean" ||
        !Number.isFinite(Number(pregunta_objetivo))
      ) {
        console.log(
          "id: ",
          id,
          "\nhoras de sueno: ",
          h_sueno,
          "\nCalidad de consumo: ",
          cal_sueno,
          "\nNúmeros de comidas: ",
          n_comidas,
          "\nCalidad de consumo: ",
          cal_consumo,
          "\nHoras de osio: ",
          h_osio,
          "\nCalidad de consumo tec: ",
          cal_consumo_tec,
          "\nUso de la IA: ",
          uso_ia,
          "\nAplicación: ",
          aplicacion,
          "\nPregunta objetivo: ",
          pregunta_objetivo,
        );
        return res
          .status(400)
          .send({ error: "No se han insertado los datos correspondientes" });
      } else {
        const sql =
          "CALL register_insert($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);";
        const result = await pool.query(sql, [
          fecha,
          Number(h_sueno),
          Number(cal_sueno),
          Number(n_comidas),
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
    next(err);
  }
});

//Búsqueda de datos por alumno
router.get("/registros/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM registro_diario WHERE id_alumno = $1;";
    const { rows } = await pool.query(sql, [id]);
    return res.status(200).send({ result: rows });
  } catch (err) {
    next(err);
  }
});

/*
Nota para el que está haciendo estos cambios: guarda estas funciones para la base de datos y así será más rápido
*/

export default router;