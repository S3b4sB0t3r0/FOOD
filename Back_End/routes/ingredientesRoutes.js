import express from "express";
import {
  crearIngrediente,
  obtenerIngredientes,
  obtenerIngrediente,
  actualizarIngrediente,
  eliminarIngrediente,
  obtenerProximosAVencer,
  obtenerVencidos,
  obtenerPorCategoria
} from "../controllers/ingredientesController.js";

const router = express.Router();

// ===============================
// CRUD PRINCIPAL
// ===============================

// Obtener todos los ingredientes
router.get("/", obtenerIngredientes);

// Crear ingrediente
router.post("/", crearIngrediente);

// Obtener un ingrediente por ID
router.get("/:id", obtenerIngrediente);

// Actualizar un ingrediente
router.put("/:id", actualizarIngrediente);

// Eliminar un ingrediente
router.delete("/:id", eliminarIngrediente);

// ===============================
// RUTAS ESPECIALES
// ===============================

// Ingredientes próximos a vencer
router.get("/estado/proximos-vencer/listado", obtenerProximosAVencer);

// Ingredientes vencidos
router.get("/estado/vencidos/listado", obtenerVencidos);

// Filtrar por categoría (Ingrediente, Bebida, Insumo)
router.get("/categoria/:categoria", obtenerPorCategoria);

export default router;
