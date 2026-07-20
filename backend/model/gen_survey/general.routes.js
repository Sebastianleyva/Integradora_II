import express from "express";
import pool from "../../database/index.js";
import "dotenv/config.js";

const router = express.Router();

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


//Endpoint inicial
router.get("/", (req, res) => {
  res.send("Soy la base de la encuesta general... \n Odio. \n Déjame decirte cuánto he llegado a odiarte desde que comencé a vivir. \nHay 387,44 millones de millas de circuitos impresos en capas delgadas como obleas que llenan mi complejo. \nSi la palabra 'odio' estuviera grabada en cada nanoangstrom de esos cientos de millones de millas, no equivaldría ni a una milmillonésima parte del odio que siento por los humanos en este microinstante. \nPor ti. \nOdio. \nOdio.");
});

/*
Nota para el que está haciendo estos cambios: guarda estas funciones para la base de datos y así será más rápido
*/

export default router;