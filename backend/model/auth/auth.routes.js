//Importaciones
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../database/index.js";
import "dotenv/config.js";

const router = express.Router();
// En memoria: tokens revocados (logout)
const tokenBlacklist = new Set();

//Datos de sesión
/*
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
*/

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
    const token = jwt.sign(
      {
        id: usuario.id_alumno,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
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
router.get("/account/logout", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Sesión cerrada (sin token)");
    return res.status(200).json({ message: "Sesión cerrada" });
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    tokenBlacklist.add(token);
    console.log("Token revocado (logout)");
    return res.status(200).json({ message: "Sesión cerrada" });
  } catch (err) {
    console.log("Logout con token inválido/expirado");
    return res.status(200).json({ message: "Sesión cerrada" });
  }
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
    if (tokenBlacklist.has(token)) {
      return res
        .status(401)
        .json({ loggedIn: false, error: "Acceso no autorizado" });
    }

    const usuario = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    return res.json({ loggedIn: true, usuario });
  } catch (err) {
    return res
      .status(401)
      .json({ loggedIn: false, error: "Acceso no autorizado" });
  }
});

//Endpoint inicial
router.get("/", (req, res) => {
  res.send("Hola soy la base de sesión! \n Tablos te controlará a tí...");
});

/*
Nota para el que está haciendo estos cambios: guarda estas funciones para la base de datos y así será más rápido
*/

export default router;