import express from "express";
import cors from "cors"
const app = express()
app.use(cors())
app.use(express.json())

app.get("/try", async (req, res) => {
    //logic->Display a list of all events,( sorted by date (upcoming first).)-> frontend
    // fetch all the value from db and send it


})

app.listen(8000, () => console.log("Server started at Port:8000"))