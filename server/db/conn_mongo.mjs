import { MongoClient } from "mongodb";

const connectionString = process.env.URI || "";

const client = new MongoClient("mongodb://127.0.0.1:27017");

let conn;
try {
  conn = await client.connect();
  console.log("Connected to MongoDB")
} catch(e) {
  console.error(e);
}

let db = conn.db("app");

export default db;