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
        let validatetoken;
        try {
            validatetoken = jwt.verify( token, process.env.JWT_SECRET);
        } catch (verifyErr) {
            console.error("Authstatus: token verification failed", { error: verifyErr && verifyErr.message, token: token ? token.substring(0,50) + '...' : token });
            throw verifyErr;
        }
        if ( !validatetoken || !validatetoken?._id ) {
            throw new Showerror( 401, "Unauthorized: Invalid token" );
        }

        const existinguser = await User.findById(validatetoken._id).select("-password -refreshToken");
        if ( !existinguser ) {
            throw new Showerror( 401, "Unauthorized: User not found" );
        }
        req.user = existinguser;
        next();
        
    } catch (error) { 
        console.error('Authstatus caught error:', error && error.message);
        throw new Showerror( 401, "Unauthorized: Invalid user" );
    }
    

})
export default Authstatus;