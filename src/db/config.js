import mongoose from "mongoose"
import ENVIROMENT from "../config/enviroment.config.js"

mongoose.connect(ENVIROMENT.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,  // 5 segundos de espera antes de agotar el tiempo
    connectTimeoutMS: 10000,         // 10 segundos para establecer la conexión
})
.then(() => {
    console.log('Conectado a la base de datos');
})
.catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
});

export default mongoose