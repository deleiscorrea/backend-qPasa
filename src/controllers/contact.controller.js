import ContactRepository from "../repositories/contact.repository.js"
import ResponseBuilder from "../utils/builder/responseBuilder.js"

export const getAllContactsController = async (req, res) => {
    try{
        const contacts_from_db = await ContactRepository.getAllContacts()
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Contactos encontrados')
        .setPayload({
            contacts: contacts_from_db
        })
        .build()
        res.json(response)
    }
    catch(error){
        console.error(error)
    }
}

export const getContactByIdController = async (req, res) => {
    try{
        const {contact_id} = req.params
        const contact_found = await ContactRepository.getContactById(contact_id)
        if(!contact_found){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(404)
            .setMessage('Error al encontrar contacto')
            .setPayload({
                detail: `El contacto ${contact_id} no existe`
            })
            .build()
            return res.json(response)
        }
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Contacto encontrado')
        .setPayload({
            contact: contact_found
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


export const createContactController = async (req, res) => {
    try{
        const {name, email, info, image} = req.body
        const admin_id = req.user.id
        if(!name){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(400)
            .setMessage('Error al crear contacto')
            .setPayload({
                detail: 'El nombre del contacto es obligatorio'
            })
            .build()
            return res.json(response)
        }
        if(!email){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(400)
            .setMessage('Error al crear contacto')
            .setPayload({
                detail: 'El email del contacto es obligatorio'
            })
            .build()
            return res.json(response)
        }
        if(image && Buffer.byteLength(image, 'base64') > 2 * 1024 * 1024){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(400)
            .setMessage('Error al crear contacto')
            .setPayload({
                detail: 'La imagen es demasiado grande'
            })
            .build()
            return res.json(response)
        }
        const newContact = {
            name,
            email,
            info,
            image: image,
            admin_id
        }
        const new_contact = await ContactRepository.createContact(newContact)
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Contacto creado')
        .setPayload({
            data: {
                name: new_contact.name,
                email: new_contact.email,
                info: new_contact.info,
                admin_id: new_contact._id,
                image: new_contact.image
            }
        })
        .build()
        return res.json(response)
    }
    catch(error){

    }
}

export const updateContactController = async (req, res) => {
    try{
        const {contact_id} = req.params
        const {name, email, info} = req.body
        const admin_id = req.user.id
        if(!name && !email && !info){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(400)
            .setMessage('Error al actualizar contacto')
            .setPayload({
                detail: 'El nombre, email o info del contacto son obligatorios'
            })
            .build()
            return res.json(response)
        }
        /* if(!name){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(400)
            .setMessage('Error al actualizar contacto')
            .setPayload({
                detail: 'El nombre del contacto es obligatorio'
            })
            .build()
            return res.json(response)
        }
        if(!email){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(400)
            .setMessage('Error al actualizar contacto')
            .setPayload({
                detail: 'El email del contacto es obligatorio'
            })
            .build()
            return res.json(response)
        } */

        const contact_found = await ContactRepository.getContactById(contact_id)
        const contactUpdated = {
            name,
            email,
            info,
        }
        if(admin_id !== contact_found.admin_id.toString()){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(403)
            .setMessage('Error al actualizar contacto')
            .setPayload({
                detail: 'No tenés permiso para actualizar este contacto'
            })
            .build()
            return res.json(response)
        }
        
        const updated_contact = await ContactRepository.updateContact(contact_id, contactUpdated)
        if(!updated_contact){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(404)
            .setMessage('Error al actualizar contacto')
            .setPayload({
                detail: `El contacto ${contact_id} no existe`
            })
            .build()
            return res.json(response)
        }
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Contacto actualizado')
        .setPayload({
            data: {
                name: contactUpdated.name,
                email: contactUpdated.email,
                info: contactUpdated.info
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

export const deleteContactController = async (req, res) => {
    try{
        const {contact_id} = req.params
        const contact_found = await ContactRepository.getContactById(contact_id)
        if(!contact_found){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(404)
            .setMessage('Error al eliminar contacto')
            .setPayload({
                detail: `El contacto ${contact_id} no existe`
            })
            .build()
            return res.json(response)
        }
        if(req.user.role !== 'admin' && req.user.id !== contact_found.admin_id.toString()){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(403)
            .setMessage('Error al eliminar contacto')
            .setPayload({
                detail: 'No tenés permiso para eliminar este contacto'
            })
            .build()
            return res.json(response)
        }

        const deleted_contact = await ContactRepository.deleteContact(contact_id)
        if(!deleted_contact){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(404)
            .setMessage('Error al eliminar contacto')
            .setPayload({
                detail: `El contacto ${contact_id} no existe`
            })
            .build()
            return res.json(response)
        }

        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Contacto eliminado')
        .setPayload({
            data: deleted_contact
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