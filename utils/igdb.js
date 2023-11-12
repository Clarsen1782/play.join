const igdb = require('igdb-api-node').default;
const { AccessToken } = require("../models");

async function initIgdbClient() {
    try {
        const accessToken = await fetchIgdbToken();
        return igdb(process.env.IGDB_CLIENT, accessToken);
    } catch (error) {
        console.log(error)
    }
}

async function fetchIgdbToken() {
    try {
        const data = await AccessToken.findByPk(1);
        const dbData = data.get({ plain: true });
        // console.log("token:", dbData.token);

        return dbData.token;
    } catch (error) {
        // console.log("Couldn't get access token from database");
        // console.log("making a new token");
        // return await getIgdbToken();
        console.log(error);
    }
}

module.exports = { initIgdbClient }