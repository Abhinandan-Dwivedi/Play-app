import {User} from '../Models/User.model.js';
import Showerror from '../Utils/ShowError.js';
import jwt from 'jsonwebtoken';
import AsyncHandler from '../Utils/AsyncHandler.js';    
import mongoose from 'mongoose';

const Authstatus  = AsyncHandler( async ( req, res, next ) => {

    try {
        const token = req.cookies?.accessToken ||  req.header("Authorization")?.replace("Bearer ", "");
        if ( !token ) {
            throw new Showerror( 401, "Unauthorized: No token provided" );
        }

        const validatetoken = jwt.verify( token, process.env.JWT_SECRET);
        if ( !validatetoken || !validatetoken?._id ) {
            throw new Showerror( 401, "Unauthorized: Invalid token" );
        }

        const existinguser = await User.findById( mongoose.Types.ObjectId( validatetoken._id ) ).select("-password -refreshToken");
        if ( !existinguser ) {
            throw new Showerror( 401, "Unauthorized: User not found" );
        }
        req.user = existinguser;
        next();
        
    } catch (error) { 
        throw new Showerror( 401, "Unauthorized: Invalid user" );
    }
    

})
export default Authstatus;