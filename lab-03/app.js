
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();

app.use(express.json());

const databasePath = path.join(__dirname, "books.db");

let database = null;

// Initialize Database and Server
const initializeDBAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    console.log("Database connected successfully!");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};

initializeDBAndServer();

// GET all books with Search, Sorting, Pagination and Price Filter
app.get("/books/", async (request, response) => {
  const {
    search_q = "",
    order_by = "title",
    order = "ASC",
    limit = 10,
    offset = 0,
    min_price,
    max_price,
  } = request.query;

  let query = "SELECT * FROM books WHERE title LIKE ?";
  let values = [`%${search_q}%`];

  // Price Filter
  if (min_price !== undefined && max_price !== undefined) {
    query += " AND price BETWEEN ? AND ?";
    values.push(Number(min_price), Number(max_price));
  } else if (min_price !== undefined) {
    query += " AND price >= ?";
    values.push(Number(min_price));
  } else if (max_price !== undefined) {
    query += " AND price <= ?";
    values.push(Number(max_price));
  }

  // Sorting and Pagination
  query += ` ORDER BY ${order_by} ${order} LIMIT ? OFFSET ?`;
  values.push(Number(limit), Number(offset));

  const books = await database.all(query, values);

  response.status(200).json(books);
});

// GET book by ID
app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const book = await database.get(
    "SELECT * FROM books WHERE id = ?",
    [bookId]
  );

  if (!book) {
    return response.status(404).json({
      message: "Book not found",
    });
  }

  response.status(200).json(book);
});

// POST a new book
app.post("/books/", async (request, response) => {
  const { title, author, price } = request.body;

  // Required POST validation
  if (!title || !author || price === undefined ||
      price === null || price === "" || isNaN(Number(price))) {
    return response.status(400).json({
      message: "Invalid book details",
    });
  }

  const query = `
    INSERT INTO books (title, author, price)
    VALUES (?, ?, ?)
  `;

  await database.run(query, [title, author, Number(price)]);

  response.status(201).json({
    message: "Book added successfully",
  });
});

// PUT update a book
app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const { title, author, price } = request.body;

  const existingBook = await database.get(
    "SELECT * FROM books WHERE id = ?",
    [bookId]
  );

  if (!existingBook) {
    return response.status(404).json({
      message: "Book not found",
    });
  }

  const query = `
    UPDATE books
    SET title = ?, author = ?, price = ?
    WHERE id = ?
  `;

  await database.run(query, [title, author, Number(price), bookId]);

  response.status(200).json({
    message: "Book updated successfully",
  });
});

// DELETE a book
app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const existingBook = await database.get(
    "SELECT * FROM books WHERE id = ?",
    [bookId]
  );

  if (!existingBook) {
    return response.status(404).json({
      message: "Book not found",
    });
  }

  await database.run(
    "DELETE FROM books WHERE id = ?",
    [bookId]
  );

  response.status(200).json({
    message: "Book deleted successfully",
  });
});

// Invalid routes
app.use((request, response) => {
  response.status(404).json({
    message: "Route not found",
  });
});
