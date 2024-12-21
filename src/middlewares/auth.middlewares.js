import jwt from 'jsonwebtoken'
import ResponseBuilder from '../utils/builder/responseBuilder.js'
import ENVIROMENT from '../config/enviroment.config.js'

export const verifyTokenMiddleware = (allowed_roles = []) => {
    return (req, res, next) => {
        try{
            const auth_header = req.headers['authorization']
            if(!auth_header){
                const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(401)
                .setMessage('Error de autorización')
                .setPayload({
                    detail: 'Falta token de autorización'
                })
                .build()
                return res.json(response)
            }
    
            const access_token = auth_header.split(' ')[1]
            if(!access_token){
                const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(401)
                .setMessage('Error de autorización')
                .setPayload({
                    detail: 'El token de autorización es invalido'
                })
                .build()
                return res.json(response)
            }
    
            const decoded = jwt.verify(access_token, ENVIROMENT.JWT_SECRET)
            req.user = decoded

            if(allowed_roles.length && !allowed_roles.includes(req.user.role)){
                const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(403)
                .setMessage('Error de acceso')
                .setPayload({
                    detail: 'No tenés los permisos necesarios para realizar esta acción'
                })
                .build()
                return res.json(response)
            }
    
            return next()
        }
        catch(error){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(401)
            .setMessage('Error al autentificar')
            .setPayload({
                detail: error.message
            })
            .build()
            return res.json(response)
        }
    }
    
}

export const verifyApyKeyMiddleware = (req, res, next) => {
    try{
        const apikey_header = req.headers['x-api-key']
        console.log("APYKEY:", apikey_header)
        if(!apikey_header){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(401)
            .setMessage('Error de autorización')
            .setPayload({
                detail: 'Falta apykey'
            })
            .build()
            return res.json(response)
        }
        if(apikey_header !== ENVIROMENT.API_KEY_INTERN){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(401)
            .setMessage('Error de autorización')
            .setPayload({
                detail: 'Apykey inválida'
            })
            .build()
            return res.json(response)
        }
        return next()  
    }
    catch(error){
        const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(500)
        .setMessage('Error interno del servidor')
        .setPayload({
            detail: 'No se pudo validar la apikey'
        })
        .build()
        return res.json(response)
    }
}
