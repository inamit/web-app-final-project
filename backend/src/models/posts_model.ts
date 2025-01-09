import mongoose, {Schema, Types} from "mongoose";
import {USER_RESOURCE_NAME} from "./users_model";
import {Likeable} from "./likeable";

export interface IPost extends Likeable {
    _id: Types.ObjectId,
    content: string;
    sender: Types.ObjectId;
    imageUrl?: string
}

const postSchema = new Schema<IPost>({
    content: {
        type: String,
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: USER_RESOURCE_NAME,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false,
    },
    likes: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: USER_RESOURCE_NAME
    },
    dislikes: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: USER_RESOURCE_NAME
    }
});

export const POST_RESOURCE_NAME = "Post";
const Post = mongoose.model<IPost>(POST_RESOURCE_NAME, postSchema);

export default Post;