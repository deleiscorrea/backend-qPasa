import express from "express"
import { forgotPasswordController, loginController, registerUserController, resetTokenController, verifyEmailValidationController } from "../controllers/auth.controller.js"
import { verifyApyKeyMiddleware } from "../middlewares/auth.middlewares.js"

const authRouter = express.Router()

authRouter.post('/register', registerUserController)
authRouter.get('/verify/:verification_token', verifyEmailValidationController)
authRouter.post('/login', loginController)
authRouter.post('/forgot-password',forgotPasswordController)
authRouter.put('/reset-password/:resetToken', resetTokenController)

export default authRouter