const path = require("path");
const sequelize = require("./config/connection");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3001;




sequelize.sync().then(() => {
    app.listen(PORT, () => console.log("Server is on!"))
})
