import Post from "../models/Post.js";
import User from "../models/User.js";

// CREATE
export const createPost = async (req, res) => {
    try {
        // DESTRUCTURE OBJECT
        const { userId, description, picturePath } = req.body;
        // GET USER
        const user = await User.findById(userId);
        // CREATE A NEW POST
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        });
        // SAVE POST
        await newPost.save();
        // GET ALL POST
        const post = await Post.find();
        res.status(201).json(post);
    } catch(err) {
        // ERROR RESPONSE
        res.status(409).json({ msg: err.message });
    }
}

// READ
export const getFeedPosts = async (req, res) => {
    try {
        // GET ALL POST
        const post = await Post.find();
        res.status(200).json(post);
    } catch(err) {
        // ERROR RESPONSE
        res.status(404).json({ msg: err.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        // GET USER ID
        const { userId } = req.params;
        // GET POSTS BY USER ID
        const post = await Post.find({ userId });
        res.status(200).json(post);
    } catch(err) {
        // ERROR RESPONSE
        res.status(404).json({ msg: err.message });
    }
}

// UPDATE
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if(isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatePost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatePost);
    } catch(err) {
        // ERROR RESPONSE
        res.status(404).json({ msg: err.message });
    }
}