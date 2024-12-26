import transporter from "../config/transporter.config.js"

const sendEmail = async (options) => {
    try{
        let response = await transporter.sendMail(options)
        console.log(response)
    }
    catch(error){    
        console.error("error al enviar mail:", error)
        throw error
    }
}  

export {sendEmail}