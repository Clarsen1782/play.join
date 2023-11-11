const router = require("express").Router();
require("dotenv").config();



async function getGamesFromKeyword(keyword) {
    const gamesUrl = process.env.IGDB_BASE_URL + "games"
    const searchStr = keyword.length > 1 ? keyword.split("%20").join(" ") : keyword
    // Get the name, cover art for only main games (where category = 0;)
    const body = 
        `search "${searchStr}"; 
        fields name, cover.*; 
        limit 30;
        where category = 0;
        `

    console.log("body:", body);


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

module.exports = router;