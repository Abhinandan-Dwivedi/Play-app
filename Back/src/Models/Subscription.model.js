import mongoose , { Schema } from "mongoose";

const subscriptionSchema = new Schema( 
    {
        // who is subscribing  
        subscriber: {
            type: Schema.Types.ObjectId,
            ref: "User"
    },
       // to which channel the subscriber is subscribed
        channels :{
            type: Schema.Types.ObjectId,
            ref: "User"
    }
}
)

export const Subscription = mongoose.model("Subscription", subscriptionSchema);