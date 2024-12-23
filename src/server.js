import ENVIROMENT from "./config/enviroment.config.js"
import express from "express"
import statusRouter from "./routes/status.router.js"
import authRouter from "./routes/auth.router.js"    
import mongoose from "./db/config.js"
import { verifyApyKeyMiddleware } from "./middlewares/auth.middlewares.js"
import contactRouter from "./routes/contacts.router.js"

const app = express()
const PORT = ENVIROMENT.PORT || 3000

const corsOptions = {
    origin: ENVIROMENT.URL_FRONT,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
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