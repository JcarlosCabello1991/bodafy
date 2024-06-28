import mongoose from 'mongoose';

// Definir el esquema de usuario
const adminUsersSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  menu: { type: String , default: ""},
  images: [
    {
      url: { type: String },
      dedicatoria: { type: String }
    }
  ],
  admin: { type: Boolean, default: true },
  guestsName: { type: String, required: true },  
  guestsPassword: {type: String, required: true},
  churchLocation: { type: String, default: "" },
  partyLocation: { type: String, default: "" },
  email: {type: String}
},{
  versionKey: false
});

// Crear el modelo de usuario
const User = mongoose.model('users', adminUsersSchema, 'users');

// Exportar el modelo de usuario
export default User;
