import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        type: Schema.types.ObjectId,
        ref: 'user'
    },
    channel: {
        type: Schema.types.ObjectId,
        ref: "user"
    }
},{timestamps: true})


export const subscription = mongoose.model("subscription", subscriptionSchema);