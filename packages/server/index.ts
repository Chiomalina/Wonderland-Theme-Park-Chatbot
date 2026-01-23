import express from "express";
import type { Response, Request } from "express";
import dotenv from "dotenv"

dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

// Anotate types in home route
app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

// Anotate types in home route
app.get("/api/hello", (req: Request, res: Response) => {
    res.json({ message: "Hello World how are you!"});
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})