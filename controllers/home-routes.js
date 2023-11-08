const router = require("express").Router();

router.get("/", async (req, res) => {
    // TODO: Show games on front page
    res.render("homepage");
});


router.get("/profile", async (req, res) => {
    // TODO: Get logged in user's information
    const userId = req.session.userId;

    res.render("profile");
});


router.get("/profile:user_id", async (req, res) => {
    // TODO: Get a user's information
    const userId = req.params.user_id;

    res.render("profile");
});

// Render the login page
router.get("/login", async (req, res) => {
    res.render("login");
});

// Render the signup page
router.get("/signup", async (req, res) => {
    res.render("signup");
});

module.exports = router;