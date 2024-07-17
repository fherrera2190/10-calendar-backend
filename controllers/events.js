const { response } = require("express");
const Evento = require("../models/Evento");

const getEventos = async (req, res = response) => {
  try {
    const eventos = await Evento.find({ user: req.uid }).populate("user", "name");
    
    res.json({
      ok: true,
      eventos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const crearEvento = async (req, res = response) => {
  const { uid } = req;

  const evento = new Evento(req.body);
  try {
    evento.user = uid;
    const eventoGuardado = await evento.save();

    res.json({
      ok: true,
      evento: eventoGuardado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const actualizarEvento = (req, res = response) => {
  const { id } = req.params;
  const { uid } = req;
  try {
    const evento = Evento.findById(id);
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontro el evento",
      });
    }
    evento = {...evento, ...req.body};
    evento.save();
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
  res.json({
    ok: true,
    msg: "actualizarEvento",
  });
};

const eliminarEvento = (req, res = response) => {
  res.json({
    ok: true,
    msg: "eliminarEvento",
  });
};

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};
