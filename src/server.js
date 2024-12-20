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

app.use(cors({
    origin: "https://backend-q-pasa.vercel.app",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization']
}));
app.use(express.json({limit: '5mb'}))
app.use(verifyApyKeyMiddleware)

app.use('/api/status', statusRouter)
app.use('/api/auth', authRouter)
app.use('/api/contacts', contactRouter)

app.listen(PORT, () => {
    console.log(`El servidor se está escuchando en http://localhost:${PORT}`)
})