import jwt from "jsonwebtoken";
import redisClient from "../services/redis.services.js";

export const authUser = async (req, res, next) => {
    
    try{
        const authHeader = req.headers.authorization;
        const token  =req.cookies.token || (authHeader && authHeader.split(' ')[1]);
        if(!token){
            return res.status(401).send({error: 'Unauthorized user'});
        }

        const isBlackListed = await redisClient.get(token);
        if(isBlackListed){
            res.cookie('token', '');
            return res.status(401).send({error: 'Unauthorized user'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(error){
        res.status(401).send({error: 'Unauthorized user'});
    }
}