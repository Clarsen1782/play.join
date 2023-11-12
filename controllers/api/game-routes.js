const router = require("express").Router();
const sequelize = require("../../config/connection");
const { User, GamerTag, Game, Friends, UserGame } = require("../../models");
require("dotenv").config();


async function getGamesFromKeyword(keyword) {
    const gamesUrl = process.env.IGDB_BASE_URL + "games"
    // If keyword has %20 from json.stringify, convert back to actual whitespace
    const searchStr = keyword.length > 1 ? keyword.split("%20").join(" ") : keyword

    // Get the name, cover art for main games and standalone expansions
    const body = 
        `search "${searchStr}"; 
        fields name, cover.*; 
        limit ${parseInt(process.env.IGDB_LIMIT)};
        where category = (0, 4);
        `

    // console.log("body:", body);


    const response = await fetch(
        gamesUrl,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Client-ID': process.env.IGDB_CLIENT,
                'Authorization': `Bearer ${process.env.IGDB_ACCESS_TOKEN}`,
            },
            body: body
        }
    );
    
    return response.json();
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