import mongoose from "mongoose"
import ENVIROMENT from "../config/enviroment.config.js"

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Intenta conectarse durante 5 segundos
    socketTimeoutMS: 45000, // Tiempo máximo para mantener el socket
}).then(() => {
    console.log('Conexión exitosa a MongoDB');
}).catch(err => {
    console.error('Error al conectar a MongoDB:', err);
});

export default mongoose