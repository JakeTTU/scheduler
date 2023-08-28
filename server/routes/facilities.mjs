import express from "express";
import db from "../db/conn_mysql.mjs";


const router = express.Router();

router.get("/loadFacilities", async (req, res) => {
  try {
    db.query("SELECT * FROM facilities", (err, result) => {
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

export default router;
