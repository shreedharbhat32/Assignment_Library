import express from "express";
import cors from "cors";
import router from "./routes/user.routes.js";

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, _, next) => {
    const contentType = req.headers['content-type'] || req.headers['Content-Type'] || '';
    
    if (req.method === 'GET' && contentType.toLowerCase().includes('application/json')) {
        if (!req.body) {
            let data = '';
            
            req.on('data', chunk => {
                data += chunk.toString();
                console.log('GET request - Received chunk, data length:', data.length);
            });
            
            req.on('end', () => {
                try {
                    if (data && data.trim()) {
                        req.body = JSON.parse(data);
                        console.log('GET request body parsed successfully:', req.body);
                    } else {
                        console.log('GET request - No data received, body is empty');
                        req.body = {};
                    }
                } catch (e) {
                    console.error('Error parsing GET request body:', e.message, 'Data:', data);
                    req.body = {};
                }
                next();
            });
            
            req.on('error', (err) => {
                console.error('GET request - Error reading body:', err);
                req.body = {};
                next();
            });
        } else {
            next();
        }
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
    console.log("API hit");
    res.send("Welcome to the Library Management System API");
});

app.use("/api/v1/user", router)

export {app}
