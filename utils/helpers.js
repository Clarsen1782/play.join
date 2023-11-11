module.exports = {
    isDefined(value) {
        return value !== undefined;
    },
    onUserProfile(isLoggedIn, isOwnProfile) {
        return isLoggedIn && isOwnProfile
    }
}
