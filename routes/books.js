const express = require("express");
const Book = require("../models/book");

const router = new express.Router();

const { Validator } = require("jsonschema");
const validator = new Validator();
const bookSchemaPost = require("../schemas/bookSchemaPost.json");
const bookSchemaPut = require("../schemas/bookSchemaPut.json");

/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:isbn", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.isbn);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  try {
    const validationResult = validator.validate(req.body, bookSchemaPost);
    if (!validationResult.valid) {
      // Validation failed
      const errors = validationResult.errors.map((error) => error.stack);
      return res.status(400).json({ errors });
    }

    const book = await Book.create(req.body);
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", async function (req, res, next) {
  try {
    const validationResult = validator.validate(req.body, bookSchemaPut);
    if (!validationResult.valid) {
      // Validation failed
      const errors = validationResult.errors.map((error) => error.stack);
      return res.status(400).json({ errors });
    }

    const book = await Book.update(req.params.isbn, req.body);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
