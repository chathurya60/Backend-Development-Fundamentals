# Lab 03 – REST API with Search, Sorting and Validation

**Name:** G. Reddy Chathurya  
**Registration Number:** 252U1R6087  
**Section:** S02

## Live Link
- Local Server: `http://localhost:3000`

## Objective
To convert the existing Lab 2 routes into a clean REST API with search, sorting, pagination, price filtering, input validation, correct HTTP status codes, and debugging.

## Technologies Used
- Node.js
- Express.js
- SQLite
- Postman
- JavaScript

## How to Run

1. Clone the repository.
2. Navigate to the lab-03 folder.
3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. Open the API:

   `http://localhost:3000/books/`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books/` | Get all books |
| GET | `/books/:bookId/` | Get a book by ID |
| POST | `/books/` | Add a new book |
| PUT | `/books/:bookId/` | Update a book |
| DELETE | `/books/:bookId/` | Delete a book |

## Query Parameters

| Parameter | Description |
|---|---|
| `search_q` | Search books by title |
| `order_by` | Sort using a column |
| `order` | Sort in ASC or DESC order |
| `limit` | Number of records to display |
| `offset` | Number of records to skip |
| `min_price` | Minimum book price |
| `max_price` | Maximum book price |

### Example Requests

```text
GET /books/?search_q=Harry
GET /books/?order_by=price&order=ASC
GET /books/?limit=3&offset=0
GET /books/?min_price=200&max_price=500
```

## HTTP Status Codes

| Status Code | Description |
|---|---|
| 200 | Successful GET, PUT and DELETE |
| 201 | Book created successfully |
| 400 | Invalid book details |
| 404 | Book not found or route not found |

## Screenshots

Add your Postman screenshots below:

1. Get All Books
2. Get Book by ID
3. Search Books
4. Sorting
5. Pagination
6. Price Range Filtering
7. Add Book (POST)
8. POST Validation
9. Update Book (PUT)
10. Delete Book (DELETE)
11. Book Not Found (404)

## Debugging

Practised identifying and fixing common backend errors:

- Port conflict (`EADDRINUSE`)
- Incorrect import paths
- Incorrect database table names
- Missing `await` in asynchronous database operations

## Conclusion

Successfully developed a REST API using Node.js, Express.js, and SQLite with search, sorting, pagination, price filtering, validation, and appropriate HTTP status codes.