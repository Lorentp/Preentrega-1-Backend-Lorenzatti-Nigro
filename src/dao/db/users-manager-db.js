const UsersModel = require("../models/users.model.js")

class UsersManager {

    async newUser({user, password}){
        try {
            if(!user || !password){
                console.log("Es obligatorio conlocar un usuario y una contrasena")
            }

            const userExists = await UsersModel.findOne({user:user})
            if(userExists){
                console.log("El usuario ya existe, intente nuevamente")
                return
            }

            const newUser = new UsersModel({
                user, password
            })
            await newUser.save()

        } catch (error) {
            console.log(error)
        }
    }
    async getUsers(){
        try {
            const users = await UsersModel.find()
            return users
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = UsersManager