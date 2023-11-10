const router = require("express").Router();
require("dotenv").config();


async function getGamesFromKeyword(keyword) {
    const gamesUrl = process.env.IGDB_BASE_URL + "games"
    const body = `search "${keyword}"; fields name, cover; limit 30;`

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
    console.log("@search");
    const keyword = req.body.keyword;
    console.log("keyword:", keyword);

    try {
        // Get a list of games
        const gamesList = await getGamesFromKeyword(keyword);
        gamesList.sort((a, b) => a.id - b.id); // Sort ascending to get the game that matches the title the best
        
        res.status(200).json(gamesList);
    } catch (error) {
        console.log("error:", error);
    }
});

module.exports = router;