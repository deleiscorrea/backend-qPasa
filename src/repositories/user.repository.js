import User from "../models/user.model.js";

class userRepository {
    static async getUserById(id){
        const user = await User.findOne({_id: id})
        return user
    }
    static async getUserByEmail(email){
        const user = await User.findOne({email})
        return user
    }

    static async saveUser(user){
        return await user.save()
    }
    
    static async setEmailVerified(value, user_id){
        const user = await userRepository.getUserById(user_id)
        user.emailVerified = value
        return await userRepository.saveUser()
    }
}

export default userRepository