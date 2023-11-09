const router = require("express").Router();
const { User, GamerTag, Game, Friends } = require("../../models");

router.get("/", async (req, res) => {
    try {
        const data = await User.findAll({
            include: [
                {
                    model: GamerTag,
                },
                {
                    model: Game
                },
                // {
                //     model: User,
                //     through: Friends
                // }
            ]
        });

        const users = data.map((element) => element.get({ plain: true }));
        
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const data = await User.findByPk(req.params.id, {
            include: [
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
        });

        const users = data.get({ plain: true });
        //TODO: Join the friender and friended arrays as one
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;