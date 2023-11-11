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
        // console.log("not a friend yet")
        return true;
    },
    isFriender(userToFriend, loggedInId) {
        for (const friend of userToFriend.friends) {
            
            if (friend.id === loggedInId && !friend.isFriend) {
                // Check if the user we're viewing sent or received the friend request to the logged in user
                return friend.isFriender;
            }
        }
    }
}
