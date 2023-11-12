const { AccessToken } = require("../models");
require("dotenv").config();

module.exports = {
    async getIgdbToken(code) {
        // Make a request to Twitch to exchange the code for an access token
        const redirect_uri = process.env.JAWSDB_URL ? process.env.REDIRECT_URI : 'http://localhost:3001/api/callback'
    
        const response = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.IGDB_CLIENT,
                client_secret: process.env.IGDB_SECRET,
                code,
                grant_type: process.env.IGDB_GRANT,
                redirect_uri: redirect_uri,
            }),
        });
    
        // Parse the JSON response
        const responseData = await response.json();
        
        // Extract the access token from the response
        const accessToken = responseData.access_token;
    
        // console.log("accessToken:", accessToken);
    
        await AccessToken.create({ token: accessToken });
    }
};