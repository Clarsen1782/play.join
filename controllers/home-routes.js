const router = require("express").Router();
const { User, GamerTag, Game, Friends } = require("../models");
const { getFriends } = require("../controllers/api/api-helpers");

router.get("/", async (req, res) => {
    // TODO: Show games on front page

    res.render("homepage", {
        loggedIn: req.session.loggedIn
    });
});


router.get("/profile/:user_id", async (req, res) => {
    // If 0 then it's the logged in user's profile, else it's someone else's
    let userId = req.params.user_id == 0 ? req.session.userId : req.params.user_id;
    console.log("userId:", userId);
    try {
        const data = await User.findByPk(userId, {
            include: [
                {
                    model: GamerTag,
                    attributes: {
                        exclude: [
                            "user_id",
                            "platform_id"
                        ]
                    }
                },
                {
                    model: Game
                },
                {
                    model: User,
                    through: Friends,
                    as: "friender",
                    attributes: [
                        "id",
                        "userName",
                    ]
                },
                {
                    model: User,
                    through: Friends,
                    as: "friended",
                    attributes: [
                        "id",
                        "userName",
                    ]
                }
            ],
            attributes: [
                "id",
                "userName",
                "isPrivate"
            ]
        });

        const user = data.get({ plain: true });
        
        getFriends(user);

        res.render("profile", {
            user,
            loggedIn: req.session.loggedIn
        })

    } catch (error) {
        res.status(500).json(error);
    }
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