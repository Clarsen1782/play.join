module.exports = {
    /**
     * Gets the user's friends from the "friender" and "friended" lists.
     * Extracts only the "isFriend" boolean and then deletes the now-unecessary "friends" join table object. That way the result is cleaner to read and we don't send back uncessary values
     * @param {Object} user 
     */
    getFriends(user) {
        const frienderList = user.friender.map((friend) => {
            const isFriend = friend.friends.isFriend;
            delete friend.friends; // Remove uncessary join table information
            friend["isFriend"] = isFriend; // State if friends yet or not
            friend["isFriender"] = true; // Determines if user sent the request or received it
            return friend;
        });

        
        const friendedList = user.friended.map((friend) => {
            const isFriend = friend.friends.isFriend;
            delete friend.friends; // Remove uncessary join table information
            friend["isFriend"] = isFriend; // State if friends yet or not
            friend["isFriender"] = false; // Determines if user sent the request or received it
            return friend;
        });

        // Remove these lists after making friends list
        delete user.friender;
        delete user.friended;

        user["friends"] = frienderList.concat(friendedList);
    },
}