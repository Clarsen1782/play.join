const router = require("express").Router();

const userRoutes = require("./user-routes");
// TODO: Add RESTful routes 

router.use("/users", userRoutes);

module.exports = router;