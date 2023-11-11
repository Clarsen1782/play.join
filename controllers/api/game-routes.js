const router = require("express").Router();
const { User, GamerTag, Game, Friends, UserGame } = require("../../models");
require("dotenv").config();


async function getGamesFromKeyword(keyword) {
    const gamesUrl = process.env.IGDB_BASE_URL + "games"
    // If keyword has %20 from json.stringify, convert back to actual whitespace
    const searchStr = keyword.length > 1 ? keyword.split("%20").join(" ") : keyword

    // Get the name, cover art for only main games (where category = 0;)
    const body = 
        `search "${searchStr}"; 
        fields name, cover.*; 
        limit ${parseInt(process.env.IGDB_LIMIT)};
        where category = 0;
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
    
    if (response.ok) {
        return response.json();
    }
}

router.post("/search", async (req, res) => {
    const keyword = req.body.keyword;

    try {
        // Get a list of games
        const gamesList = await getGamesFromKeyword(keyword);
        gamesList.sort((a, b) => a.name - b.name); // Sort ascending 

        res.status(200).json(gamesList);
    } catch (error) {
        console.log("error:", error);
    }
});

/**
 * 
 */
router.post("/:game_id", async (req, res) => {
    try {
        const data = await Game.findByPk(req.params.game_id);

        if (!data) {
            console.log("game doesn't exist in db yet, so let's add it");
            await Game.create({
                id: req.params.game_id,
                name: req.body.gameName
            });

        }

        res.status(200).json(data);
    } catch (error) {
        console.log("couldn't find game")
        res.status(500).json(error ? error : { message: "Couldn't find game in db" });
    }
});

module.exports = router;