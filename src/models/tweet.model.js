import mongoose, {Schema} from "mongoose";

const tweetschema = new Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        required:true
    },
    ispublished:{
        type: Boolean,
        default: true
    },

},{timestamps:true})


export const Tweet = mongoose.model("Tweet", tweetschema)