module.exports = {
    debug(value) {
        console.log("value:", value);
    },
    isDefined(value) {
        return value !== undefined;
    },
    canAddFriend(userToFriend, loggedInId) {
        for (const friend of userToFriend.friends) {
            // Checks if the user being viewed IS friends with the user logged in
            if (friend.id === loggedInId && friend.isFriend) {
                // console.log("is a friend");
                return false;
            }
        }

        // User can be added as a friend
        return true;
    }
}
