const { response } = require('express');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async (req, res = response) => {

    const {email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese correo'
            })
        }

        usuario = new Usuario(req.body);

        //Encriptar contraseña

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        
        await usuario.save();

        // Generar JWT

        const token = await generarJWT(usuario.id, usuario.name);


        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

}


const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
         const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario no existe con ese email'
            })
        }

        // Confirmar si los password hacen match

        const validPassword = bcrypt.compareSync(password, usuario.password);

        if ( ! validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            })
        }

        // Generar nuestro JWT

        
        const token = await generarJWT(usuario.id, usuario.name);


        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

        
    } catch (error) {

         res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
        
    }

}


const revalidarToke = async (req, res = response) => {

    const { uid, name } = req;

    // Generar un nuevo JWT y retornalo en esta peticion

      const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        uid,
        name,
        token
    })
}
module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToke
}