/* 
    Rutas de Usuario / Auth
    host + /api/auth

*/
const {Router} = require('express');
const { crearUsuario, loginUsuario, revalidarToke } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');



const router = Router();

router.post(
    '/new',
    [   // middleware
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser minimo de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser minimo de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario);

router.get('/renew', validarJWT,  revalidarToke);

module.exports = router;