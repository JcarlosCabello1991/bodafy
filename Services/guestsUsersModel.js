import mongoose from 'mongoose';

// Definir el esquema de usuario
const guestsUsersSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  menu: { type: String, default: ''},
  images: [
    {
      url: { type: String },
      dedicatoria: { type: String }
    }
  ],
  admin: { type: Boolean, default: false },
  idAdmin: {type: mongoose.Schema.Types.ObjectId },//String,
  churchLocation: { type: String, default: "" },
  partyLocation: { type: String, default: "" }
},{
  versionKey: false
});

// Crear el modelo de usuario
const GuestUser = mongoose.model('guests', guestsUsersSchema, 'guests');

// Exportar el modelo de usuario
export default GuestUser;
