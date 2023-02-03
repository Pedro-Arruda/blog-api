const router = require("express").Router();

const Post = require("../models/Post");

router.post("/", async (req, res) => {
  const { title, imgCover, content, tags, author, active } = req.body;

  if (!title) {
    res.status(401).json({ error: "title obrigatório" });
    return;
  }

  const post = {
    title,
    imgCover,
    content,
    tags,
    author,
    active,
    createdAt: new Date().toISOString(),
  };

  try {
    await Post.create(post);

    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.patch("/:id", async (req, res) => {
  const id = req.params.id;

  const { title, imgCover, content, tags, author, active } = req.body;

  const post = {
    title,
    imgCover,
    content,
    tags,
    author,
    active,
  };

  try {
    const updatedPost = await Post.updateOne({ _id: id }, post);

    if (updatedPost.matchedCount === 0) {
      res.status(404).json({ message: "Produto não encontrado" });
      return;
    }

    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/", async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: err });
  }
});

router.get("/:tag", async (req, res) => {
  const tag = req.params.tag;

  try {
    const post = await Post.find({ tags: tag });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: err });
  }
});

router.get("/id/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const post = await Post.findOne({ _id: id });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
