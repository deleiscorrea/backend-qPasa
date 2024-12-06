import express from "express"
import { verifyApyKeyMiddleware, verifyTokenMiddleware } from "../middlewares/auth.middlewares.js"
import { createContactController, deleteContactController, getAllContactsController, getContactByIdController, updateContactController } from "../controllers/contact.controller.js"

const contactRouter = express.Router()

contactRouter.use(verifyApyKeyMiddleware)

contactRouter.get('/', verifyTokenMiddleware(), getAllContactsController)
contactRouter.get('/:contact_id', verifyTokenMiddleware(), getContactByIdController)
contactRouter.post('/', verifyTokenMiddleware(['admin']), createContactController)
contactRouter.put('/:contact_id', verifyTokenMiddleware(['admin']), updateContactController)
contactRouter.delete('/:contact_id', verifyTokenMiddleware(['admin']), deleteContactController)

export default contactRouter