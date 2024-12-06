import express from "express"
import { forgotPasswordController, loginController, registerUserController, resetTokenController, verifyEmailValidationController } from "../controllers/auth.controller.js"
import { verifyApyKeyMiddleware } from "../middlewares/auth.middlewares.js"

const authRouter = express.Router()

authRouter.post('/register', verifyApyKeyMiddleware, registerUserController)
authRouter.get('/verify/:verification_token', verifyEmailValidationController)
authRouter.post('/login', verifyApyKeyMiddleware, loginController)
authRouter.post('/forgot-password', verifyApyKeyMiddleware,forgotPasswordController)
authRouter.put('/reset-password/:resetToken', verifyApyKeyMiddleware, resetTokenController)

export default authRouter