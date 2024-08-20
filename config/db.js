const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://LuisAlvarez:Caraballo236@chat-bot.hteyc.mongodb.net/Chat-Bot?retryWrites=true&w=majority&appName=Chat-Bot'



const connectDB = async () => {

try{
mongoose.connect(mongoURI);
console.log('Conectado a MongoDB')
}catch(error){
    console.error('Error al conectar a MongoDB:', error);
}
};
module.exports = connectDB;