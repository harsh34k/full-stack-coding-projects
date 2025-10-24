import express from "express";
import cors from "cors"
import { PrismaClient } from './generated/prisma/index.js'
import { randomUUID } from "crypto";


const app = express()
app.use(express.json())
app.use(cors())
const prisma = new PrismaClient()


app.get("/init", (req, res) => {
    const userKey = randomUUID();
    res.status(200).json({ userKey });
});


app.get("/event", async (req, res) => {
    //logic->Display a list of all events,( sorted by date (upcoming first).)-> frontend
    // fetch all the value from db and send it
    const data = await prisma.event.findMany({
        where: {
            userKey: req.userKey
        }
    })
    return res.status(200).json({ message: "Done", data })
})

app.post("/event", async (req, res) => {
    try {
        const { title, description = "", userKey } = req.body;
        if (!(title?.trim())) return res.status(404).json({ message: "input credential are not valid" })
        const newEvent = await prisma.event.create({
            data: {
                title,
                description,
                userKey
            }
        })
        if (!newEvent) {
            return res.status(500).json({ message: "An error occorued in our backend" })
        }
        return res.status(200).json({ message: "Event created successfully", newEvent })
    } catch (error) {
        if (err instanceof prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            return res.status(409).json({ message: "Event already exists for this user" });
        }
        console.error("POST /event error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }



})

app.put("/event", async (req, res) => {
    try {
        const { title, userKey, description, date } = req.body;

        if (!title?.trim() || !userKey?.trim()) {
            return res.status(400).json({ message: "Title and userKey are required" });
        }

        const updatedEvent = await prisma.event.update({
            where: { title_userKey: { title, userKey } },
            data: {
                description,
                date: date ? new Date(date) : undefined,
            },
        });

        return res.status(200).json({
            message: "Event updated successfully",
            data: updatedEvent,
        });
    } catch (err) {
        if (err.code === "P2025") {
            return res.status(404).json({ message: "Event not found" });
        }
        console.error("PUT /event error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Step 5: Delete an event (by title + userKey)
app.delete("/event", async (req, res) => {
    try {
        const { title, userKey } = req.body;

        if (!title?.trim() || !userKey?.trim()) {
            return res.status(400).json({ message: "Title and userKey are required" });
        }

        await prisma.event.delete({
            where: { title_userKey: { title, userKey } },
        });

        return res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        if (err.code === "P2025") {
            return res.status(404).json({ message: "Event not found" });
        }
        console.error("DELETE /event error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(8000, () => console.log("Server started at Port:8000"))