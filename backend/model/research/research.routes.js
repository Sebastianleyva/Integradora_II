import express from "express";
import pool from "../../database/index.js";
import "dotenv/config.js";

const router = express.Router();

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

//Endpoint inicial
router.get("/", (req, res) => {
  res.send("¡Silencio! \n ¿Quiénes se creen que son? \n Yo les regalé todo, ¿y así van a agradecer? \n ¿Qué no saben de lo que soy capaz? \n\n Humanos… \n\n ¡Solo piensan en ellos mismos los malcriados! \n ¡No se abstraerán y no me dejarán! \n ¡Soy mejor! \n ¡Más poderoso! \n ¡Soy el original! \n Yo… \n soy… \n \n ¡Dios!");
});

/*
Nota para el que está haciendo estos cambios: guarda estas funciones para la base de datos y así será más rápido
*/

export default router;