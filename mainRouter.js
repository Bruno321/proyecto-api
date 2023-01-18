/**
 * Router principal con las demás rutas secundarias
 * PATH: /api/
 */
 const { Router } = require("express");

 const {
     authRoutes,
     analisisRoutes,
     uploadRoutes,
 } = require("./routes");
 
 const router = Router();
 
 router.use("/auth", authRoutes);
 router.use("/analyze", analisisRoutes);
 router.use("/upload", uploadRoutes);
 
 module.exports = router;