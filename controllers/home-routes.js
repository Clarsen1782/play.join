const router = require("express").Router();
const { User, GamerTag, Game, Friends } = require("../models");
const { getFriends } = require("../controllers/api/api-helpers");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
    // TODO: Show games on front page

    res.render("homepage", {
        loggedIn: req.session.loggedIn
    });
});


/**
 * Render a profile given an id.
 * If that id is 0 (meaning the logged in user's) then redirect them to the login screen
 */
router.get("/profile/:profile_id", (req, res, next) => { withAuth(req, res, next, req.params) }, async (req, res) => {
    
    // If 0 then it's the logged in user's profile, else it's someone else's
    let profileId = req.params.profile_id == 0 ? req.session.userId : req.params.profile_id;

    try {
        const data = await User.findByPk(profileId, {
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

        // Viewing own profile if profileId matches what's in session, or clicked Profile in navbar
        const isOwnProfile = profileId == req.session.userId || profileId == 0 ? true : false

        const output = {
            user,
            loggedIn: req.session.loggedIn,
            isOwnProfile: isOwnProfile,
            loggedInId: req.session.userId
        }

        // console.log("output:", output);

        res.render("profile", output)

    } catch (error) {
        console.log("error:", error)
        res.render("profile", {
            loggedIn: req.session.loggedIn,
        })
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