/**
 * Checks if a user is logged in or not for specific routes.
 * For checking a profile: If the user is trying to access /profile/0 then they're redirected to the login screen, if it's not /0 then show that user's profile
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {Object} params 
 */
function withAuth(req, res, next, params) {
    console.log("")
    if (!req.session.loggedIn) {
        if (params.profile_id == 0) {
            res.render("login");
        } else { // Maybe add more logic for other things
            next();
        }
    } else {
        next();
    }
}

module.exports = withAuth;