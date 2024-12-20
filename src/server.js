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

const cors = require('cors')
const corsOptions = {
    origin: ["http://localhost:5173", "https://frontend-q-pasa-d908zpg13-ignacios-projects-ff75f73a.vercel.app/"],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsOptions))
app.use(express.json({limit: '5mb'}))
app.use(verifyApyKeyMiddleware)

app.use('/api/status', statusRouter)
app.use('/api/auth', authRouter)
app.use('/api/contacts', contactRouter)

app.listen(PORT, () => {
    console.log(`El servidor se está escuchando en http://localhost:${PORT}`)
})