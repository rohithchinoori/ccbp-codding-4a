const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3002, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
//API1
app.get("/players/", async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
     FROM
     cricket_team
    ORDER BY
     player_id;`;

  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});
//API2
app.post("/players/", async (request, response) => {
  const bookDetails = request.body;
  const { playerName, jerseyNumber, role } = bookDetails;
  const addBookQuery = `
    INSERT INTO
      cricket_team (player_name,jersey_number,role)
    VALUES
      (
       '${playerName}',
       '${jerseyNumber}',
       '${role}'
        
      );`;

  const dbResponse = await db.run(addBookQuery);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});
//API3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getBookQuery = `
    SELECT
      *
    FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  const book = await db.get(getBookQuery);
  response.send(book);
});

//API4

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const bookDetails = request.body;
  const { playerName, jerseyNumber, role } = bookDetails;
  const updateBookQuery = `
    UPDATE
      cricket_team
    SET
      player_name='${playerName}',
      jersey_number='${jerseyNumber}',
      role='${role}'
    WHERE
      player_id = ${playerId};`;
  await db.run(updateBookQuery);
  response.send("Player Details Updated");
});

//API5

app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deleteBookQuery = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  await db.run(deleteBookQuery);
  response.send("Player Removed");
});

module.exports = app;
