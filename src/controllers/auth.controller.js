import ENVIROMENT from "../config/enviroment.config.js"
import User from "../models/user.model.js"
import ResponseBuilder from "../utils/builder/responseBuilder.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendEmail } from "../utils/mail.util.js"
import userRepository from "../repositories/user.repository.js"

export const registerUserController = async (req, res) => {
    try{
        const { name, email, password } = req.body
        //hacer validaciones
        const existentUser = await User.findOne({ email: email })
        if(existentUser){
            const response = new ResponseBuilder()            
            .setOk(false)
            .setStatus(400)
            .setMessage('Error al registrar usuario')
            .setPayload({
                detail: 'El correo electrónico ya está en uso'
            })
            .build()
            return res.json(response)
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = jwt.sign({email: email}, ENVIROMENT.JWT_SECRET, {expiresIn: '1d'})

        const url_verification = `${ENVIROMENT.URL_FRONT}/api/auth/verify/${verificationToken}`
        await sendEmail({
            to: email,
            subject: 'Verificación de correo electrónico',
            html: `
            <h1>Verificá tu correo</h1>
            <a 
            href=${url_verification}
            style="background-color: black; color: white; padding: 5px; border-radius: 5px"
            >Click acá</a>
            `
        })
        
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            verificationToken: verificationToken,
            emailVerified: false
        })
        await newUser.save()

        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(201)
        .setMessage('Usuario registrado con éxito')
        .setPayload({
            message: 'Verificá tu correo para completar el registro'
        })
        .build()
        return res.json(response)
    }
    catch(error){
        console.error("error al registrar usuario:", error)
        const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(500)
        .setMessage('Error interno del servidor')
        .setPayload({
            detail: error.message
        })
        .build()
        return res.json(response)
    }
}

const resultado = bcrypt.compareSync("juanperon123", "$2b$10$9o1uzsLIp5Aq5Byb/6Esz.FvMvQz2h.7VVSc6DlUGQKMbvp8T5qnm")   
console.log({resultado})

export const verifyEmailValidationController = async (req, res) => {
    try{
        const {verification_token} = req.params
        if(!verification_token){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(400)
            .setMessage('Error al validar correo electrónico')
            .setPayload({
                detail: 'Falta enviar token'
            })
            .build()
            return res.json(response)
        }

        const decoded = jwt.verify(verification_token, ENVIROMENT.JWT_SECRET)
        const user = await User.findOne({email: decoded.email})
        if(!user){
            //LOGICA DE ERROR NOT-FOUND
        }
        if(user.emailVerified){
            //LOGICA DE EMAIL YA VERIFICADO (ERROR 400)
        }

        user.emailVerified = true
        /* user.verificationToken = undefined */

        await user.save()

        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Email verificado con éxito')
        .setPayload({
            message: 'Usuario validado'
        })
        .build()
        return res.json(response)
    }
    catch(error){
        console.error(error)
    } 
}

export const loginController = async (req, res) => {
    try{
        const {email, password} = req.body
        const user = await User.findOne({email: email})
        if(!user){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(404)
            .setMessage('Error al iniciar sesión')
            .setPayload({
                detail: 'El correo electrónico no esta registrado'
            })
            .build()
            return res.json(response)
        }
        if(!user.emailVerified){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(403)
            .setMessage('Error al iniciar sesión')
            .setPayload({
                detail: 'El correo electrónico no ha sido verificado'
            })
            .build()
            return res.json(response)
        }

        const isValidPassword = await bcrypt.compare(password, user.password)
        if(!isValidPassword){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(401)
            .setMessage('Error al iniciar sesión')
            .setPayload({
                detail: 'La contraseña es incorrecta'
            })
            .build()
            return res.json(response)
        }

        const token = jwt.sign({email: user.email, id: user._id, role: user.role}, ENVIROMENT.JWT_SECRET, {expiresIn: '1d'})
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Iniciaste sesión con éxito')
        .setPayload({
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
        .build()
        return res.json(response)
    }
    catch(error){
        const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(500)
        .setMessage('Error interno del servidor')
        .setPayload({
            detail: error.message
        })
        .build()
        return res.json(response)
    }
}

export const forgotPasswordController = async (req, res) => {
    try{
        const {email} = req.body
        //validamos que llegue el email
        const user = await userRepository.getUserByEmail(email)
        if(!user){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(404)
            .setMessage('Error al restablecer contraseña')
            .setPayload({
                detail: 'El correo electrónico no esta registrado'
            })
            .build()
            return res.json(response)
        }
        
        const resetToken = jwt.sign({email: user.email}, ENVIROMENT.JWT_SECRET, {expiresIn: '1h'})
        const resetUrl = `${ENVIROMENT.URL_FRONT}/reset-password/${resetToken}`
        sendEmail({
            to: user.email,
            subject: 'Restablecer contraseña',
            html: `
            <h1>Restablecé tu contraseña</h1>
            <p>Hacé click en el siguiente enlace para restablecer tu contraseña</p>
            <a 
            href=${resetUrl}
            style="background-color: black; color: white; padding: 5px; border-radius: 5px"
            >Click acá</a>
            `
        })
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Restablecimiento de contraseña enviado con éxito')
        .setPayload({})
        .build()
        return res.json(response)
    }    
    catch(error){

    }
}

export const resetTokenController = async (req, res) => {
    try{
        const {password} = req.body
        const {resetToken} = req.params
        if(!password){
            const response = new ResponseBuilder()            
            .setOk(false)
            .setStatus(400)
            .setMessage('Error al restablecer contraseña')
            .setPayload({
                detail: 'El campo de contraseña es obligatorio'
            })
            .build()
            return res.json(response)
        }
        if(!resetToken){
            const response = new ResponseBuilder()            
            .setOk(false)
            .setStatus(400)
            .setMessage('Error al restablecer contraseña')
            .setPayload({
                detail: 'El token no es válido o ha expirado'
            })
            .build()
            return res.json(response)
        }

        const decoded = jwt.verify(resetToken, ENVIROMENT.JWT_SECRET)
        console.log(decoded)
        if(!decoded){
            const response = new ResponseBuilder()            
            .setOk(false)
            .setStatus(400)
            .setMessage('Error al restablecer contraseña')
            .setPayload({
                detail: 'El token de verificación falló'
            })
            .build()
            return res.json(response)
        }

        const {email} = decoded

        const user = await userRepository.getUserByEmail(email)
        if(!user){
            const response = new ResponseBuilder()            
            .setOk(false)
            .setStatus(400)
            .setMessage('Error al restablecer contraseña')
            .setPayload({
                detail: 'Usuario inexistente o invalido' 
            })
            .build()
            return res.json(response)
        }
        const encriptedPassword = await bcrypt.hash(password, 10)
        user.password = encriptedPassword
        await user.save()
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Restablecimiento de contraseña exitoso')
        .setPayload({
            message: 'Se actualizó la contraseña'
        })
        .build()
        return res.json(response)
        
    }
    catch(error){
        console.error(error)
        const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(500)
        .setMessage('Error interno del servidor')
        .setPayload({
            detail: error.message
        })
        .build()
        return res.json(response)
    }
}

