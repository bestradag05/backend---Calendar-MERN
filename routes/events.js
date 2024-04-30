const { Router } = require('express');
const { getEventos, crearEvento, actualizarEvento, elimnarEvento } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');






const router = Router();

// Validar que todas tengan el JWT
router.use(validarJWT);

// Obtener eventos
router.get('/' ,getEventos);


// crear un nuevo evento
router.post('/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
        validarCampos
    ],
    crearEvento
);


//Actualizar Eventos
router.put('/:id', actualizarEvento);

// Borrar evento
router.delete('/:id', elimnarEvento);


module.exports = router;