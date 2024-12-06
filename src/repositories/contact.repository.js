import Contact from "../models/contact.model.js";

class ContactRepository {
    static async getAllContacts() {
        return await Contact.find({})
    }

    static async getContactById(id) {    
        return await Contact.findById(id)
    }

    static async createContact(contact_data) {    
        const new_contact = new Contact(contact_data)
        return new_contact.save()
    }

    static async updateContact(id, new_contact_data) {    
        return await Contact.findByIdAndUpdate(id, new_contact_data), {new: true}
    } 

    static async deleteContact(id) {    
        return await Contact.findByIdAndDelete(id)
    }

    
}