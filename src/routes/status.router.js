import express from "express"
import { getPingController } from "../controllers/status.controller.js"
import { verifyApyKeyMiddleware, verifyTokenMiddleware } from "../middlewares/auth.middlewares.js"

const statusRouter = express.Router()

statusRouter.get('/ping', getPingController)
statusRouter.get('/protected-route/ping', verifyTokenMiddleware(['admin', 'user']), getPingController)

export default statusRouter