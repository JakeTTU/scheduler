import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import "express-async-errors";
import db from "./db/conn_mysql.mjs"
import user from "./routes/user.mjs";
import events from "./routes/events.mjs";
import facilities from "./routes/facilities.mjs";
import contacts from "./routes/contacts.mjs";

const SERVER_PORT = process.env.SERVER_PORT || 8000;
const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
const app = express();

app.use(cors());
app.use(express.json());

// Load the / routes
app.use("/user", user);
app.use("/events", events);
app.use("/facilities", facilities);
app.use("/contacts", contacts);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// start the Express server
app.listen(SERVER_PORT, () => {
  console.log(`Server is running at: http://${SERVER_HOST}:${SERVER_PORT}`);
});
