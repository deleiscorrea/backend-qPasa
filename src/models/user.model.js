import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    verificationToken: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        required: true
    }
})

const User = mongoose.model('User', userSchema)

export default User