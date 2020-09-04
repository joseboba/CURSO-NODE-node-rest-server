const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const categoriaSchema = new Schema({
    descripcion: { type: String, unique: true, required: [true, 'Es requerida una descripcion'] },
    usuario: {type: Schema.Types.ObjectId, ref: 'usuario', required: [true, 'Es requerido un usuario']}
})

categoriaSchema.plugin(uniqueValidator, {message: '{PATH} no puede ser duplicado'})
module.exports = mongoose.model('categoria', categoriaSchema)