/**
 * Router principal con las demás rutas secundarias
 * PATH: /api/
 */
 const { Router } = require("express");

 const {
     authRoutes,
     analisisRoutes,
     uploadRoutes,
     filtroRoutes
 } = require("./routes");
 
 const router = Router();
 
 router.use("/auth", authRoutes);
 router.use("/analyze", analisisRoutes);
 router.use("/upload", uploadRoutes);
 router.use("/filtro", filtroRoutes);
 
 module.exports = router;