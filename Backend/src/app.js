import express from "express";
import router from "./routes/user.routes.js";

const app = express();
app.use(express.json({
    limit:"10kb"
}));
app.use(express.urlencoded({extended:true, limit:"10kb"}));
app.use(express.static("public"));
// app.use(cookieParser());    
 

app.get("/", (req, res) => {
    res.send("Welcome to the Library Management System API");
});

app.use("/api/v1/user", router)

export {app}
