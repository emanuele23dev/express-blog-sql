const posts = require("../db/posts.js");
const fs = require("fs");
const connection = require("../db/connection.js");

const index = (req, res) => {
  const sql = "SELECT * FROM posts";

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    const responsData = {
      data: results,
      count: results.length,
    };
    res.status(200).json(responsData);
  });
};

const show = (req, res) => {
  const post = posts.find(
    (post) => post.title.toLowerCase() === req.params.title
  );
  // console.log(post);

  if (!post) {
    return res
      .status(404)
      .json({ error: `post con titolo ${req.params.title} non trovato` });
  }

  return res.status(200).json({
    data: post,
  });
};

const store = (req, res) => {
  const post = {
    title: req.body.title,
    slug: req.body.slug,
    content: req.body.content,
    image: req.body.image,
    categoria: req.body.categoria,
    tags: req.body.tags,
  };

  posts.push(post);

  fs.writeFileSync(
    "./db/posts.js",
    `module.exports = ${JSON.stringify(posts, null, 4)}`
  );

  // console.log(req.body);

  return res.status(201).json({
    status: 201,
    data: posts,
    count: posts.length,
  });
};

const update = (req, res) => {
  const post = posts.find(
    (post) => post.title.toLowerCase() === req.params.title
  );

  if (!post) {
    res.status(404).json({
      error: `nessun post con questo titolo ${req.params.titolo}`,
    });
  }

  post.title = req.body.title;
  post.slug = req.body.slug;
  post.content = req.body.content;
  post.image = req.body.image;
  post.tags = req.body.tags;

  fs.writeFileSync(
    "./db/posts.js",
    `module.exports = ${JSON.stringify(posts, null, 4)}`
  );

  res.status(200).json({
    status: 200,
    data: posts,
  });
};

const destroy = (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM posts WHERE id =?";

  connection.query(sql, [id], (err, results) => {
    console.log(err, results.affectedRows);

    if (err) return res.status(500).json({ error: err });

    if (results.affectedRows === 0)
      return res
        .status(404)
        .json({ error: `404! No post found with this id: ${id}` });

    return res.status(204).json({
      status: 204,
    });
  });
};

// const titleToDelete = req.params.title.toLowerCase();
// const index = posts.findIndex(
//   (post) => post.title.toLowerCase() === titleToDelete
// );

// if (index === -1) {
//   return res.status(404).json({ error: "Post non trovato" });
// }

// posts.splice(index, 1);

// fs.writeFileSync(
//   "./db/posts.js",
//   `module.exports = ${JSON.stringify(posts, null, 4)}`
// );

// return res.json({ data: posts });

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
