
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "database", "users.db");

let db = null;

const initializeDBAndServer = async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      name TEXT,
      password TEXT
    );`;

  await db.run(createUserTableQuery);

  const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}/`);
    });
};

initializeDBAndServer();

// Register API
app.post("/register/", async (request, response) => {
  const { username, name, password } = request.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const selectUserQuery = `
    SELECT * FROM user WHERE username = ?`;

  const dbUser = await db.get(selectUserQuery, [username]);

  if (dbUser === undefined) {
    const createUserQuery = `
      INSERT INTO user (username, name, password)
      VALUES (?, ?, ?)`;

    const dbResponse = await db.run(createUserQuery, [
      username,
      name,
      hashedPassword,
    ]);

    const newUserId = dbResponse.lastID;

    response.send(`Created new user with ${newUserId}`);
  } else {
    response.status(400);
    response.send("User already exists");
  }
});

// Login API with JWT
app.post("/login/", async (request, response) => {
  const { username, password } = request.body;

  const selectUserQuery = `
    SELECT * FROM user WHERE username = ?`;

  const dbUser = await db.get(selectUserQuery, [username]);

  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid User");
  } else {
    const isPasswordMatched = await bcrypt.compare(
      password,
      dbUser.password
    );

    if (isPasswordMatched === true) {
      const payload = {
        username: username,
      };

      const jwtToken = jwt.sign(payload, "a-string-secret-at-least-256-bits-long");

      response.send({ jwt_token: jwtToken });
    } else {
      response.status(400);
      response.send("Invalid Password");
    }
  }
});
