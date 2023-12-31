const router = require("express").Router();

const userRoutes = require("./user-routes");
const gameRoutes = require("./game-routes");
const gamerTagRoutes = require('./gamerTag-routes');

const { getIgdbToken } = require("../../utils/getIgdbToken");

router.use("/users", userRoutes);
router.use("/games", gameRoutes);
router.use('/gamertags', gamerTagRoutes);

router.get("/callback", async (req, res) => {
    // console.log("hello at /callback");

    try {
        const code = req.query.code;

        await getIgdbToken(code);

        res.status(200).json({ "message": "Got access token" });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;