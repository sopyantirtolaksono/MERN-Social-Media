import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// CONTROLLER REGISTER
export const register = async (req, res) => {
    try {
        // GET ALL DATA USER FROM FORM REGISTER
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        // ENCRYPTION PASSWORD
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // CREATE NEW USER
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });

        // SAVE NEW USER
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
        
        console.log(savedUser);
    } catch(err) {
        // ERROR RESPONSE
        res.status(500).json({ error: err.message });
        
        console.log(`Error: ${err.message}`);
    }
}

// CONTROLLER LOGIN
export const login = async (req, res) => {
    try {
        // GET ALL DATA USER FROM FORM LOGIN
        const {email, password} = req.body;
        // GET ALL DATA USER LOGIN
        const user = await User.findOne({ email: email });
        // IF USER NOT EXIST
        if(!user) return res.status(400).json({ msg: "user does not exist" });

        // COMPARE PASSWORD USER
        const isMatch = await bcrypt.compare(password, user.password);
        // IF NOT MATCH
        if(!isMatch) return res.status(400).json({ msg: "invalid credentials" });

        // CREATE TOKEN
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    } catch(err) {
        // ERROR RESPONSE
        res.status(500).json({ msg: err.message });
    }
}