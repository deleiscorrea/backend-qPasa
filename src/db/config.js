import mongoose from "mongoose"
import ENVIROMENT from "../config/enviroment.config.js"

mongoose.connect(ENVIROMENT.DB_URL)
.then(
    () => {
        console.log('Conectado a la base de datos')
    }
)
.catch(
    (error) => {
        console.error("Error al conectar a la base de datos")
    }
)

export default mongoose