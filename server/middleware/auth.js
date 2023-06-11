import jwt from "jsonwebtoken";

// VERIFY TOKEN
export const verifyToken = async (req, res, next) => {
    try {
        // GET HEADER
        let token = req.header("Authorization");
        // IF TOKEN NOT EXIST
        if(!token) return res.status(403).send("access denied");
        // SLICE AND TAKE TOKENS
        if(token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch(err) {
        // ERROR RESPONSE
        res.status(500).json({ msg: err.message });
    }
}