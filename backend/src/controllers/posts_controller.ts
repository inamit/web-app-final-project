import { Request, Response } from "express";
import { handleMongoQueryError } from "../db/db";
import Post, { IPost, POST_RESOURCE_NAME } from "../models/posts_model";
import mongoose from "mongoose";
import { saveFile } from "../middleware/file-storage/file-storage-middleware";

const getPosts = async (req: Request, res: Response): Promise<any> => {
  const { userId }: { userId?: string } = req.query;

  try {
    let posts: IPost[] | null = await (userId
      ? Post.find({ userId: userId })
      : Post.find());
    return res.json(posts);
  } catch (err: any) {
    console.warn("Error fetching posts:", err);
    return handleMongoQueryError(res, err);
  }
};

const saveNewPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      userId: req.params.userId,
      imageUrl: req.file?.path ?? "",
    });
    const savedPost: IPost = await post.save();
    return res.json(savedPost);
  } catch (err: any) {
    console.warn("Error saving post:", err);
    return handleMongoQueryError(res, err, POST_RESOURCE_NAME);
  }
};

const getPostById = async (req: Request, res: Response): Promise<any> => {
  const { post_id }: { post_id?: string } = req.params;

  try {
    const post: IPost | null = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json(post);
  } catch (err: any) {
    console.warn("Error fetching post:", err);
    return handleMongoQueryError(res, err);
  }
};

const updatePostById = async (req: Request, res: Response): Promise<any> => {
  const { post_id }: { post_id?: string } = req.params;
  const { content, title }: { content?: string, title?: string } = req.body;

  try {
    if (!content && !title) {
      return res.status(400).json({ error: "Content or title is required." });
    }

    const updatedPost: IPost | null = await Post.findByIdAndUpdate(
      post_id,
      { title, content, userId: req.params.userId },
      { new: true, runValidators: true }
    );

    if (updatedPost?.imageUrl) {
      updatedPost.imageUrl = req.file?.path ?? "";
    }
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found." });
    }

    return res.json(updatedPost);
  } catch (err: any) {
    console.warn("Error updating post:", err);
    return handleMongoQueryError(res, err, POST_RESOURCE_NAME);
  }
};

const saveImage = (req: Request, res: Response): void => {
  saveFile(req, res);
};

const likePost = async (req: Request, res: Response): Promise<any> => {
  return toggleReaction(req, res, "likes");
};

const dislikePost = async (req: Request, res: Response): Promise<any> => {
  return toggleReaction(req, res, "dislikes");
};

export const toggleReaction = async (
  req: Request,
  res: Response,
  reactionType: "likes" | "dislikes"
) => {
  const userId = req.params.userId;
  const postId = req.params.postId;

  try {
    const post: IPost = (await Post.findById(postId)) as IPost;
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    getReaction(reactionType, post, userId);

    await Post.findOneAndUpdate(post);

    res.status(200).json({
      message: `${reactionType} toggled successfully.`,
      likesAmount: post.likes?.length,
      dislikesAmount: post.dislikes?.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

function getReaction(
  reactionType: "likes" | "dislikes",
  post: IPost,
  userId: string
) {
  const currentReactionArray =
    reactionType === "likes" ? post.likes : post.dislikes;
  const oppositeReactionArray =
    reactionType === "likes" ? post.dislikes : post.likes;

  if (currentReactionArray) {
    const alreadyReacted: boolean = currentReactionArray.some(
      (id) => String(id) === String(userId)
    );
    if (alreadyReacted) {
      post[reactionType] = currentReactionArray.filter(
        (id) => !id.equals(userId)
      );
    } else {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      currentReactionArray.push(userObjectId);
      post[reactionType === "likes" ? "dislikes" : "likes"] =
        oppositeReactionArray?.filter((id) => !id.equals(userId));
    }
  }
}
export default {
  getPosts,
  saveNewPost,
  getPostById,
  updatePostById,
  saveImage,
  likePost,
  dislikePost,
};
