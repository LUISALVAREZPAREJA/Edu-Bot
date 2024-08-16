const User = require('../models/user')

async function getByNumber(numero) {
    try{
        const user = await User.findOne({celular:numero});
        if (!user) {
            console.log('Usuario no encontrado');
        }
        return user;
    } catch (error){
       console.log('Error al obtener usuario ' + error.message);
    }
}

module.exports = getByNumber;