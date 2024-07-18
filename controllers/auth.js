const { response } = require("express");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({ email });
    if (usuario)
      return res.status(400).json({ ok: false, msg: "El usuario ya existe" });

    usuario = new Usuario(req.body);

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    const token = await generarJWT(usuario.id, usuario.name);

    res
      .status(201)
      .json({ ok: true, uid: usuario._id, name: usuario.name, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "Error inesperado" });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario)
      return res.status(400).json({ ok: false, msg: "Credenciales invalidos" });

    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword)
      return res.status(400).json({ ok: false, msg: "Credenciales invalidos" });

    const token = await generarJWT(usuario.id, usuario.name);

    res
      .status(200)
      .json({ ok: true, uid: usuario._id, name: usuario.name, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "Error inesperado" });
  }
};

const revalidarToken = async (req, res = response) => {
  const { uid, name } = req;
  try {
    const token = await generarJWT(uid, name);

    res.status(200).json({ ok: true, token, uid, name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "Error inesperado" });
  }
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
