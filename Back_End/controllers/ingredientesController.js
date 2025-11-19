import Ingrediente from "../models/Ingrediente.js";

// ===============================
// Crear nuevo ingrediente
// ===============================
export const crearIngrediente = async (req, res) => {
  try {
    const nuevoIngrediente = new Ingrediente(req.body);
    await nuevoIngrediente.save();
    res.status(201).json({ message: "Ingrediente creado", data: nuevoIngrediente });
  } catch (error) {
    res.status(400).json({ message: "Error al crear ingrediente", error });
  }
};

// ===============================
// Obtener todos los ingredientes
// ===============================
export const obtenerIngredientes = async (req, res) => {
  try {
    const ingredientes = await Ingrediente.find().sort({ nombre: 1 });
    res.json(ingredientes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener ingredientes", error });
  }
};

// ===============================
// Obtener un ingrediente por ID
// ===============================
export const obtenerIngrediente = async (req, res) => {
  try {
    const ingrediente = await Ingrediente.findById(req.params.id);

    if (!ingrediente) {
      return res.status(404).json({ message: "Ingrediente no encontrado" });
    }

    res.json(ingrediente);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener ingrediente", error });
  }
};

// ===============================
// Actualizar ingrediente
// ===============================
export const actualizarIngrediente = async (req, res) => {
  try {
    const ingredienteActualizado = await Ingrediente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!ingredienteActualizado) {
      return res.status(404).json({ message: "Ingrediente no encontrado" });
    }

    // Ejecutar middleware manualmente para recalcular el estado
    await ingredienteActualizado.save();

    res.json({ message: "Ingrediente actualizado", data: ingredienteActualizado });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar ingrediente", error });
  }
};

// ===============================
// Eliminar ingrediente
// ===============================
export const eliminarIngrediente = async (req, res) => {
  try {
    const eliminado = await Ingrediente.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return res.status(404).json({ message: "Ingrediente no encontrado" });
    }

    res.json({ message: "Ingrediente eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar ingrediente", error });
  }
};

// ===============================
// Ingredientes próximos a vencer (7 días)
// ===============================
export const obtenerProximosAVencer = async (req, res) => {
  try {
    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() + 7);

    const ingredientes = await Ingrediente.find({
      fechaVencimiento: { $gte: hoy, $lte: limite }
    });

    res.json(ingredientes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener próximos a vencer", error });
  }
};

// ===============================
// Ingredientes vencidos
// ===============================
export const obtenerVencidos = async (req, res) => {
  try {
    const hoy = new Date();
    const ingredientes = await Ingrediente.find({
      fechaVencimiento: { $lt: hoy }
    });

    res.json(ingredientes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener vencidos", error });
  }
};

// ===============================
// Filtrar por categoría
// ===============================
export const obtenerPorCategoria = async (req, res) => {
  try {
    const categoria = req.params.categoria;

    const ingredientes = await Ingrediente.find({
      categoria: categoria
    });

    res.json(ingredientes);
  } catch (error) {
    res.status(500).json({ message: "Error al filtrar ingredientes", error });
  }
};
