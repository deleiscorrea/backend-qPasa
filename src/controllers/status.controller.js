import ResponseBuilder from "../utils/builder/responseBuilder.js"

export const getPingController = (req, res) => {
    try{
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Éxito')
        .setPayload({
            message: 'pong'
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