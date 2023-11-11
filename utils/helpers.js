module.exports = {
    debug(value) {
        console.log("value:", value);
    },
    isDefined(value) {
        return value !== undefined;
    },
    /**
     * Checks if the user being viewed can be added as a friend.
     * @param {Object} userToFriend 
     * @param {Int} loggedInId 
     * @returns true if a friend request can be sent, false if not.
     */
    canAddAsFriend(userToFriend, loggedInId) {
        // console.log("@canAddAsFriend")
        for (const friend of userToFriend.friends) {
            // Checks if the user being viewed IS friends with the user logged in
            if (friend.id === loggedInId && friend.isFriend) {
                // console.log("no, already a friend");
                return false;
            }
        }

        // User can be added as a friend
        // console.log("yes, not a friend yet")
        return true;
    },
    /**
     * Determines if the user being viewed has a friend request from the logged in user
     * @param {Object} userToFriend 
     * @param {Int} loggedInId 
     * @returns 
     */
    didSendRequest(userToFriend, loggedInId) {
        // console.log("@didSendRequest")
        for (const friend of userToFriend.friends) {
            if (friend.id === loggedInId) {
                // console.log("yes, sent a request");
                return true;
            }
        }

        // User can be added as a friend
        // console.log("no, no request sent")
        return false;
    },
    /**
     * Determines if the logged in user should see "Accept Friend Request" or "Waiting for..." depending on who sent the friend request.
     * @param {Object} userToFriend 
     * @param {Int} loggedInId 
     * @returns true if user being viewed sent the request (accept), false if the logged in user sent the request (waiting).
     */
    isFriender(userToFriend, loggedInId) {
        // console.log("@isFriender")
        for (const friend of userToFriend.friends) {
            
            if (friend.id === loggedInId && !friend.isFriend) {
                // Check if the user we're viewing sent or received the friend request to the logged in user
                // console.log("friend.isFriender:", friend.isFriender);
                return friend.isFriender;
            }
        }
    }
}
