import User from "../models/User.js";

export const getUser = async (req, res) => {
    try {
        // GET USER ID
        const { id } = req.params;
        // GET USER BY ID
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch(err) {
        // ERROR RESPONSE
        res.status(404).json({ msg: err.message });
    }
}

export const getUserFriends = async (req, res) => {
    try {
        // GET USER ID
        const { id } = req.params;
        // GET USER BY ID
        const user = await User.findById(id);
        // GET USER FRIENDS
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        // FORMATTED FRIENDS
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch(err) {
        // ERROR RESPONSE
        res.status(404).json({ msg: err.message });
    }
}

// (UPDATE) ADD AND REMOVE FRIEND
export const addRemoveFriend = async (req, res) => {
    try {
        // GET ID USER AND FRIEND USER
        const { id, friendId } = req.params;
        // GET DATA USER AND FRIEND
        const user = await User.findById(id);
        const friend = await User.findById(friendId);
        // CEK UNFOLLOW OR FOLLOW
        if(user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((friendId) => friendId !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        // UPDATE AND SAVE
        await user.save();
        await friend.save();
        // GET USER FRIENDS
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        // FORMATTED FRIENDS
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath }
            }
        );
        res.status(200).json(formattedFriends);
    } catch(err) {
        // ERROR RESPONSE
        res.status(404).json({ msg: err.message });
    }
}