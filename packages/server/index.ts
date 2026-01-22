import express from "express";
import type { Response, Request } from "express";

const app = express();
const port = process.env.PORT || 3000;

// Anotate types in home route
app.get("/", (req: Request, res: Response) => {
    res.send("Hello Nigeria!");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})