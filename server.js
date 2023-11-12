const path = require("path");
const sequelize = require("./config/connection");
const cors = require('cors'); // Might need for IGDB api call
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
require("dotenv").config();
require("./models"); // Import the models so sequelize will create the tables

const helpers = require("./utils/helpers");
const routes = require("./controllers");

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: parseInt(process.env.COOKIE_AGE),
        secure: false,
        sameSite: 'strict',
    },
    store: new SequelizeStore({
        db: sequelize,
    }),
}

app.use(session(sess));

const hbs = exphbs.create({ helpers });

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
// app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

sequelize.sync().then(() => {
    app.listen(PORT, () => console.log("Server is on!"))
})
