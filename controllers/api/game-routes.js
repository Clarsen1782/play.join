const router = require("express").Router();
const sequelize = require("../../config/connection");
const { AccessToken, User, GamerTag, Game, Friends, UserGame } = require("../../models");
const { initIgdbClient } = require("../../utils/igdb");
require("dotenv").config();

let client;
initIgdb();

/**
 * Initializes the client through the igdb.js file.
 */
async function initIgdb() {
    try {
        client = await initIgdbClient();
        // console.log("client:", client);
    } catch (error) {
        console.log(error)
    }
}

async function getGamesFromKeyword(keyword) {
    try {
        const response = await client
            .fields('name, cover.*')
            .limit(parseInt(process.env.IGDB_LIMIT))
            .search(keyword.length > 1 ? keyword.split("%20").join(" ") : keyword) // search for a specific name (search implementations can vary)
            .where(`category = (0, 4)`) // filter the results
            .request('/games'); // execute the query and return a response object

        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }

    return {}
}

router.post("/search", async (req, res) => {
    try {
        const keyword = req.body.keyword;
        // Get a list of games
        const gamesList = await getGamesFromKeyword(keyword);
        gamesList.sort((a, b) => a.name - b.name); // Sort ascending 

        res.status(200).json(gamesList);
    } catch (error) {
        console.log("error:", error);
    }
});

/**
 * Finds a game given a game_id
 */
router.post("/:game_id", async (req, res) => {
    try {
        const gameId = req.params.game_id;

        const [game, created] = await Game.findOrCreate({
            where: {
                id: gameId
            },
            include: [
                { 
                    model: User,
                    attributes: [
                        "id"
                    ]
                }
            ],
            defaults: {
                id: gameId,
                name: req.body.gameName
            }
        });
        
        const data = game.get({ plain: true });
        if (!created) {
            // console.log("getting player count")
            // If game wasn't just created, get the amount of players that favorited this game
            
            data.playerCount = data.users.length;
        } else {
            data.playerCount = 0;
        }

        delete data.users; // Don't need a list of users when searching for a game

        res.status(200).json(data);
    } catch (error) {
        console.log("couldn't find game")
        res.status(500).json(error ? error : { message: "Couldn't find game in db" });
    }
});


router.get("/:game_id", async (req, res) => {
    try {
        const gameId = req.params.game_id;

        const data = await Game.findOne({
            where: {
                id: gameId
            },
            include: [
                {
                    model: User,
                    attributes: [
                        "id",
                        "userName"
                    ]
                }
            ]
        });

        
        if (!data) {
            console.log("Couldn't find game");
            res.sendStatus(404);
        }
        
        const game = data.get({ plain: true });
        res.status(200).json(game);

    } catch (error) {
        console.log("error:", error)
        res.sendStatus(500);
    }
});

module.exports = router;