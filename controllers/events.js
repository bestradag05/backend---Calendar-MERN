const Evento = require("../models/Evento");



const getEventos = async (req, res) => {

    const eventos = await Evento.find().populate('user', 'name');

    res.json({
        ok: true,
        eventos
    })
}


const crearEvento = async (req, res) => {
    // Verificar que tenga el evento

    const evento = new Evento(req.body);

    try {

        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            evento: eventoGuardado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }


}


const actualizarEvento = async (req, res) => {

    const eventoID = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoID);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: "Evento no existe con ese id"
            })
        }


        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            })
        }


        const nuevoEvento = {
            ...req.body,
            user: uid
        }


        const eventoActualizado = await Evento.findByIdAndUpdate(eventoID, nuevoEvento, { new: true } /* Para que retorne el evento actualizado */);


        res.json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }



}

const elimnarEvento = async (req, res) => {
    const eventoID = req.params.id;
    const uid = req.uid;

    const evento = await Evento.findById(eventoID);

    if (!evento) {
        return res.status(404).json({
            ok: false,
            msg: "Evento no existe con ese id"
        })
    }


     if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para eliminar este evento'
            })
        }


    try {
         const eventoEliminado = await Evento.findByIdAndDelete(eventoID);


        res.json({
            ok: true,
            evento: eventoEliminado
        })

        
    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: "Pongase en contacto con el administrador"
        })
        
    }

}


module.exports = {

    getEventos,
    crearEvento,
    actualizarEvento,
    elimnarEvento
}