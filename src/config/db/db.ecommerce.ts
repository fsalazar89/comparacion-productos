// const { Pool } = require("pg");
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_MS_HOST,
  port: parseInt(process.env.DB_MS_PORT || '5432', 10),
  database: process.env.DB_MS_DB,
  user: process.env.DB_MS_USER,
  password: process.env.DB_MS_PASS,
  max: 20,
  connectionTimeoutMillis: 5000, // Timeout al obtener conexión del pool
  idleTimeoutMillis: 30000, // Cerrar conexiones inactivas después de 30 segundos
  allowExitOnIdle: false, // No cerrar el pool si todas las conexiones están inactivas
});

pool.on("connect", () => {
  console.log("Conexión exitosa a la base de datos PostgreSQL gestor_ecommerce");
});

export default pool;