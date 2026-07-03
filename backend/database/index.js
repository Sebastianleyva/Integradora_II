// Importaciones
import "dotenv/config.js";

import { Pool } from "pg";

console.log(process.env.DB_NAME);
// Pool de conexiones PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Eventos del pool
pool.on("connect", () => {
  console.log("✓ Cliente conectado al pool");
});

pool.on("error", (err) => {
  console.error("Error inesperado en cliente inactivo:", err);
});

// Verificación inicial de conexión
(async () => {
  try {
    const client = await pool.connect();
    console.log("✓ Conexión a PostgreSQL establecida");
    client.release();
  } catch (err) {
    console.error("✗ No se pudo conectar a PostgreSQL:", err.message);
  }
})();

export default pool;
