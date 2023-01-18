/**
 * Ruta para dar acceso de usuario a los coordinadores
 * Path: api/upload/
 */
const { Router } = require("express");
const router = Router();
const { uploadController } = require("../controllers");

/**
 * Inicia sesion de un coordinador
 */
router.post("/", uploadController.upload);


module.exports = router;