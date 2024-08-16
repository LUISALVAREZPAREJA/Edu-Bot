const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/Chat-Bot';


const connectDB = async () => {

try{
mongoose.connect(mongoURI);
console.log('Conectado a MongoDB')
}catch(error){
    console.error('Error al conectar a MongoDB:', error);
}
};
module.exports = connectDB;