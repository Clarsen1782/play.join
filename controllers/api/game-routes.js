const router = require("express").Router();
const sequelize = require("../../config/connection");
const { User, GamerTag, Game, Friends, UserGame } = require("../../models");
require("dotenv").config();

// Initialize igdb package
const igdb = require('igdb-api-node').default;
const client = igdb(process.env.IGDB_CLIENT, process.env.IGDB_ACCESS_TOKEN);


async function getGamesFromKeyword(keyword) {
    try {
        const response = await client
        .fields('name, cover.*') // same as above
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

        // Either find or create a Game
        const [game, created] = await Game.findOrCreate({
            where: {
                id: gameId
            },
            defaults: {
                id: gameId,
                name: req.body.gameName
            }
        });
        
        const data = game.get({ plain: true });

        if (!created) {
            // console.log("getting player count")
            // If game wasn't just created, get the amount of players that favorited this game
            const { count } = await UserGame.findAndCountAll({
                where: {
                    game_id: gameId
                },
            });
            
            data.playerCount = count;
        } else {
            data.playerCount = 0;
        }

        res.status(200).json(data);
    } catch (error) {
        console.log("couldn't find game")
        res.status(500).json(error ? error : { message: "Couldn't find game in db" });
    }
});

module.exports = router;