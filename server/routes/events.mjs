import express from "express";
import db from "../db/conn_mysql.mjs";

const router = express.Router();

router.get("/loadEvents", async (req, res) => {
  try {
    db.query("SELECT * FROM events", (err, result) => {
      if (err) {
        console.error("Error executing MySQL query:", err);
        res.status(503).json({ error: "Error executing MySQL query" });
        return;
      }
      // console.log(result);
      res.status(200).json(result);
    });
  } catch (e) {
    console.error("Error:", e);
    res.status(503).json({ error: "An error occurred" });
  }
});

router.post("/createEvent", async (req, res) => {
  try {
    db.query(
      "INSERT INTO events (event_id, user_id, date, facility, equipment, form1, form2, start_datetime, end_datetime, approval_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      Object.values(req.body.eventDbObj),
      (err, result) => {
        if (err) {
          console.error("Error executing MySQL query:", err);
          res.status(503).json({ error: "Error creating event" });
          return;
        }
        // console.log(result);
        res.status(201).json({ message: "Event created successfully" });
      }
    );
  } catch (e) {
    console.error("Error:", e);
    res.status(503).json({ error: "An error occurred" });
  }
});

router.post("/approveEvent", async (req, res) => {
  try {
    db.query(
      "UPDATE events SET approval_status = ? WHERE event_id = ?;",
      Object.values(req.body.obj),
      (err, result) => {
        if (err) {
          console.error("Error executing MySQL query:", err);
          res.status(503).json({ error: "Error approving event" });
          return;
        }
        res.status(201).json({ message: "Event approved successfully" });
      }
    );
  } catch (e) {
    console.error("Error:", e);
    res.status(503).json({ error: "An error occurred" });
  }
});

export default router;
