import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String,     // cloudaniry url
        required: true
    },
    thumbnail: {
        type: String,     // cloudaniry url
        required: true
    },
    title: {
        type: String,     
        required: true
    },
    description: {
        type: String,     
        required: true
    },
    duration: {
        type: Number,     // cloudaniry url
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.types.ObjectId,
        ref: "User"
    }
    
},{timestamp: true})

videoSchema.plugin(mongooseAggregatePaginate)

export const video =mongoose.model("video",videoSchema)
