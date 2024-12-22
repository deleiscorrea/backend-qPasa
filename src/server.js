import ENVIROMENT from "./config/enviroment.config.js"
import express from "express"
import statusRouter from "./routes/status.router.js"
import authRouter from "./routes/auth.router.js"    
import mongoose from "./db/config.js"
import cors from "cors"
import { verifyApyKeyMiddleware } from "./middlewares/auth.middlewares.js"
import contactRouter from "./routes/contacts.router.js"

const app = express()
const PORT = ENVIROMENT.PORT || 3000

const corsOptions = {
    origin: ['http://localhost:5173', 'https://frontend-q-pasa.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}
app.use(cors(corsOptions))
app.use(express.json({limit: '5mb'}))
/* app.use(verifyApyKeyMiddleware) */
app.options('*', cors(corsOptions));

app.use('/api/status', statusRouter)
app.use('/api/auth', authRouter)
app.use('/api/contacts', contactRouter)

import { createServer } from "http";
const server = createServer(app);

export default (req, res) => {
    server.emit('request', req, res);
};