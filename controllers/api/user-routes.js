const router = require("express").Router();
const sequelize = require("../../config/connection");
const { User, GamerTag, Game, Friends, UserGame } = require("../../models");

// Get all users and all their information
router.get("/", async (req, res) => {
    try {
        const data = await User.findAll({
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
                    foreignKey: "user_id",
                    attributes: [
                        "id",
                        "userName",
                    ]
                },
                {
                    model: User,
                    through: Friends,
                    as: "friended",
                    foreignKey: "friend_id",
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

        const users = data.map((element) => {
            const user = element.get({ plain: true });
            getFriends(user);
            return user;
        });
        
        
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json(error);
    }
}); 


// Get a user and all their info
router.get("/:id", async (req, res) => {
    // If 0 then it's the logged in user's profile, else it's someone else's
    let userId = req.params.id === 0 ? req.session.userId : req.params.id;

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

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json(error);
    }
}); 


// Get a user's friends
router.get("/:id/friends", async (req, res) => {
    const userId = req.params.id;

    try {
        const data = await User.findByPk(userId, {
            include: [
                {
                    model: User,
                    through: Friends,
                    as: "friender",
                    attributes: [
                        "id",
                        "userName",
                    ],
                },
                {
                    model: User,
                    through: Friends,
                    as: "friended",
                    attributes: [
                        "id",
                        "userName",
                    ],
                }
            ],
            attributes: [
                "id",
                "userName"
            ]
        });

        const user = data.get({ plain: true });
        
        getFriends(user);
        // console.log("user:", user);

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json(error);
    }
});

// Login a user and update the session data.
router.post("/login", async (req, res) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    try {
        const data = await User.findOne({
            where: {
                email: userEmail
            }
        });

        if (!data) {
            res.status(404).json({ "message": "Email doesn't exist. Please try again or sign up"});
            return;
        }

        const isPasswordValid = data.checkPassword(userPassword);
        if (!isPasswordValid) {
            res.status(400).json({ "message": "Invalid email or password. Please try again"});
            return;
        }

        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.userId = data.id

            res.status(200).json({ user: data, messaged: "Logged in!"});
        });

    } catch (error) {
        res.status(500).json(error ? error : { "message": "Error 500. Couldn't login"})
    }
});

// Sign up a new user
router.post("/signup", async (req, res) => {
    try {
        const data = await User.create(req.body);

        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.userId = data.id;

            res.status(200).json({ user: data, "message": "Signed up!"});
        });

    } catch (error) {
        res.status(500).json(error ? error : { "message": "Error signing up. Please try again" });
    }
});


router.post("/addFriend", async (req, res) => {
    const friendRequest = {
        user_id: req.session.userId,
        friend_id: req.body.friendId,
        isAccepted: false // Friend requests are always false at the beginning
    }
    
    try {
        const data = await Friends.create(friendRequest);

        res.status(200).json({ data: data, "message": "Sent friend request" });
    } catch (error) {
        res.status(500).json(error ? error : { "message": "Couldn't send friend request" });
    }
})


/**
 * Gets the user's friends from the "friender" and "friended" lists.
 * Extracts only the "isFriend" boolean and then deletes the now-unecessary "friends" join table object. That way the result is cleaner to read and we don't send back uncessary values
 * @param {Object} user 
 */
function getFriends(user) {
    const frienderList = user.friender.map((friend) => {
        const isFriend = friend.friends.isFriend;
        delete friend.friends; // Remove uncessary join table information
        friend["isFriend"] = isFriend; // State if friends yet or not
        return friend;
    });

    
    const friendedList = user.friended.map((friend) => {
        const isFriend = friend.friends.isFriend;
        delete friend.friends; // Remove uncessary join table information
        friend["isFriend"] = isFriend; // State if friends yet or not
        return friend;
    });

    // Remove these lists after making friends list
    delete user.friender;
    delete user.friended;

    user["friends"] = frienderList.concat(friendedList);
}

module.exports = router;