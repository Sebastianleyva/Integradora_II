import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config.js";
import researchRoutes from "./research.routes.js"

//Aplicación y puerto
const app = express();
app.set("trust proxy", 1);
const port = process.env.PORT || 5002;
//Restricciones
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: "https://bienestaru.netlify.app", // Tu URL de Netlify sin la diagonal al final
    credentials: true, // Permite el intercambio de cookies/sesiones
  }),
);

app.use((req, res, next) => {
    console.log(`[Recurso] ${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

app.use('/hp', (req, res) => {
    res.json({servicio: "Encuesta de investigación", estado: "ok"})
});
app.use("/", researchRoutes);

app.use((err, req, res, next) => {
    console.error("Error del servidor", err);
    res.status(500).json({error: "Error interno del servidor, contacta con soporte o inténtalo de nuevo"});
});

//El resto de cosas
app.all("/*splat", (req, res) => {
  return res.status(404).send({ mensaje: "La ruta no existe" });
});

//El escuchar
app.listen(port, "0.0.0.0", () => {
  console.log(`Caine es el dueño del show en el puerto ${port}`);
});

// Manejo de errores no capturados
process.on("uncaughtException", (err) => {
  console.error("Error no capturado:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Promise rechazada no manejada:", reason);
});

/*
Nota para el que está haciendo estos cambios: guarda estas funciones para la base de datos y así será más rápido
*/