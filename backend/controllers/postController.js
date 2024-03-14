import { v2 as cloudinary } from "cloudinary";

import User from "../models/userModel.js";
import Post from "../models/postModel.js";

const createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let { img } = req.body;

    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "Les champs postéPar et texte sont requis" });
    }

    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ error: "Non autorisé à poster" });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res.status(400).json({
        error: `Le text ne doit pas dépasser ${maxLength} caractères`,
      });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({ postedBy, text, img });

    await newPost.save();
    res.status(201).json({ message: "Nouveau post créé", newPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Erreur dans createPost: ", error.message);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post introuvable" });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Erreur dans getPost: ", error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post introuvable" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Action non autorisée" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Erreur dans deletePost: ", error.message);
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post introuvable" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post disliké" });
    } else {
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post liké" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Erreur dans likeUnlikePost: ", error.message);
  }
};

const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res.status(400).json({ error: "Le champ text est requis" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post introuvable" });
    }

    const reply = { userId, text, username, userProfilePic };

    post.replies.push(reply);
    await post.save();

    res.status(200).json({ message: "Réponse ajoutée", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Erreur dans replyToPost: ", error.message);
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    const following = user.following;

    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    res.status(200).json(feedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Erreur dans getFeedPosts: ", error.message);
  }
};

export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
};
