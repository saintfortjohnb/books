process.env.NODE_ENV = "test";

const app = require("../app");
const request = require("supertest");

describe("Books API Routes", () => {
  // Test data for book
  const book = {
    isbn: "0691161518",
    amazon_url: "http://a.co/eobPtX2",
    author: "Matthew Lane",
    language: "english",
    pages: 264,
    publisher: "Princeton University Press",
    title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    year: 2017,
  };

  // Test GET /books
  describe("GET /books", () => {
    it("should return a list of all books", async () => {
      const res = await request(app).get("/books");
      expect(res.statusCode).toBe(200);
      expect(res.body.books).toEqual(expect.any(Array));
    });
  });

  // Test POST /books
  describe("POST /books", () => {
    it("should create a new book", async () => {
      const res = await request(app).post("/books").send(book);
      expect(res.statusCode).toBe(201);
      expect(res.body.book).toEqual(expect.any(Object));
      expect(res.body.book.isbn).toBe(book.isbn);
    });

    it("should return 400 if request body is invalid", async () => {
      const res = await request(app).post("/books").send({ invalid: "data" });
      expect(res.statusCode).toBe(400);
    });
  });
  
  // Test GET /books/:isbn
  describe("GET /books/:isbn", () => {
    it("should return a book by ISBN", async () => {
      const res = await request(app).get(`/books/${book.isbn}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.book).toEqual(expect.any(Object));
      expect(res.body.book.isbn).toBe(book.isbn);
    });

    it("should return 404 if book not found", async () => {
      const res = await request(app).get("/books/invalid-isbn");
      expect(res.statusCode).toBe(404);
    });
  });
  
  // Test PUT /books/:isbn
  describe("PUT /books/:isbn", () => {
    it("should update a book by ISBN", async () => {
      const updatedBook = { ...book, title: "Updated Title" };
      const res = await request(app)
        .put(`/books/${book.isbn}`)
        .send(updatedBook);
      expect(res.statusCode).toBe(200);
      expect(res.body.book).toEqual(expect.any(Object));
      expect(res.body.book.title).toBe(updatedBook.title);
    });

    it("should return 400 if request body is invalid", async () => {
      const res = await request(app).put(`/books/${book.isbn}`).send({ invalid: "data" });
      expect(res.statusCode).toBe(400);
    });

    it("should return 404 if book not found", async () => {
      const res = await request(app).put("/books/invalid-isbn").send(book);
      expect(res.statusCode).toBe(404);
    });
  });

  // Test DELETE /books/:isbn
  describe("DELETE /books/:isbn", () => {
    it("should delete a book by ISBN", async () => {
      const res = await request(app).delete(`/books/${book.isbn}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Book deleted");
    });

    it("should return 404 if book not found", async () => {
      const res = await request(app).delete("/books/invalid-isbn");
      expect(res.statusCode).toBe(404);
    });
  });
});
