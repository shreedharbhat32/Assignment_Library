import express from "express";
import router from "./routes/user.routes.js";

const app = express();
app.use(express.json()); 

app.get("/", (req, res) => {
    res.send("Welcome to the Library Management System API");
});

app.use("/api/v1/user", router)

export {app}
