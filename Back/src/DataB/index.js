import { db_name } from "../constants.js";
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log( process.env.mongoose_uri + "/" + db_name );
        const connectionstable = await mongoose.connect(`${process.env.mongoose_uri}/${db_name}`);
        console.log(`MongoDB connected: ${connectionstable.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error); 
        process.exit(1);
    } 
}
export default connectDB;