const { Router } = require("express");
const router = Router();
const { filtrosController } = require("../controllers");

/**
 * Inicia sesion de un coordinador
 */
router.post("/", filtrosController.filtrar);


module.exports = router;