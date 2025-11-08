import express from "express";
import { getMovimientos } from "../controllers/movimientosController.js";

const router = express.Router();
router.get("/", getMovimientos);

export default router;
