const { Router } = require("express");
const router = Router();
const { analisisController } = require("../controllers");

/**
 * Inicia sesion de un coordinador
 */
router.post("/", analisisController.analyze);


module.exports = router;