const router = require("express").Router();

router.get("/", (req, res) => {
    // TODO: Show games on front page
    res.render("homepage");
});


module.exports = router;