import express from "express";
import db from "../db/conn_mysql.mjs";

const router = express.Router();

router.post("/login",async(req,res)=>{
  const {email, password} = req.body
  console.log('login request recieved')
  try{
    db.query(
        "SELECT * FROM users WHERE email = ? AND password = ?", [email,password], 
        (err, result) => {
            if (err) {
                res.send({err: err})
                console.log(err)
            }
            if (result.length > 0) {
                const d = (JSON.parse(JSON.stringify(result[0])))
                res.json({valid: true, role: d.role})
                console.log('login granted')
            } else {
                res.send('notexist')
                console.log('user doesnt exist')
            }
        }
    )
  }
  catch(e){
      console.log('query failed')
      res.json("failed query")
  }
})

router.post("/createUser", async (req, res) => {
    try {
      db.query(
        "INSERT INTO users (email, role, password) VALUES (?, ?, ?)",
        Object.values(req.body.newUserObj),
        (err, result) => {
          if (err) {
            console.error("Error executing MySQL query:", err);
            res.status(503).json({ error: "Error creating user" });
            return;
          }
          // console.log(result);
          res.status(201).json({ message: "User created successfully" });
        }
      );
    } catch (e) {
      console.error("Error:", e);
      res.status(503).json({ error: "An error occurred" });
    }
  });

export default router;
