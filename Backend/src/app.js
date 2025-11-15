import express from "express";
import router from "./routes/user.routes.js";

const app = express();

// Custom middleware to parse JSON bodies for GET requests
app.use((req, res, next) => {
    if (req.method === 'GET' && req.headers['content-type'] === 'application/json') {
        let data = '';
        req.on('data', chunk => {
            data += chunk.toString();
        });
        req.on('end', () => {
            try {
                if (data) {
                    req.body = JSON.parse(data);
                } else {
                    req.body = {};
                }
            } catch (e) {
                req.body = {};
            }
            next();
        });
    } else {
        next();
    }
});

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
