const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    asignatura: {
        type: String,
        required: true,

    },
    celular: {
        type: String,
        required: true

    }


});

const User = mongoose.model('User', userSchema);

module.exports = User;