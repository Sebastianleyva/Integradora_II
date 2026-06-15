//importaciones
import { v4 as uuid } from "uuid";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config.js"
import pg, {Pool} from "pg";

//puertos
const app = express();
const port = 5000;

//Restricciones
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

//lo de la base de datos
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

pool.on('error', (err, client) => {
  console.error('Error inesperado en cliente inactivo', err);
  process.exit(-1);
});

//Endpoint 
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