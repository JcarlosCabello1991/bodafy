import express from 'express';
import User from './adminUsersModel.js';
import GuestUser from './guestsUsersModel.js';

const user = express.Router();

user.post('/auth', async (req, res) => {
  try {
    //Encontrar el usuario segun el nombre de usuario recibido
    const data = req.body;
    const userName = data.userName;
    const password = data.password;

    let result;

    //Primero buscamos entre los Admin Users
    let user = await User.findOne({ userName: userName, password: password });

    if(!!user){
      result = {error: false, message: user};
    }else{
      //Buscamos entre los usuarios invitados
      let guest = await GuestUser.findOne({ userName: userName, password: password });
      
      if(!!guest){
        result = {error: false, message: guest};
      }else{
        result = {error: true, message: "Nombre de usuario/contraseña incorrectos"};
      }
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({error: true,  message: error.message });
  }
});

user.get('/deal/:id', async(req, res) => {
  const id = req.params.id;
  let result;

  //Ahora obtener el user con este id y devolvemos el menu
  //este id puede ser admin o guest por lo que sino esta en uno hay que buscar en otro
  try {
    let user = await User.findOne({_id: id});

    if(!!user){
      result = {error: false, message: user}
    }else{
      let guest = await GuestUser.findOne({_id: id});

      if(!!guest){
        result = {error: false, message: guest};
      }else{
        result = {error: true, message: "Algo fue mal"};
      }
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({error: true,  message: error.message });
  }  
})

user.post('/deal', async (req, res) => {

  const data = req.body;
  const menu = data.deal;
  const id = data.id;
  const guestUsername = data.guestName;
  const guestPassword = data.guestPassword;

  let result;

  try {
    let user = await User.findOneAndUpdate({_id: id}, {menu: menu}, {new:true});
    let guestUser = await GuestUser.findOneAndUpdate({userName: guestUsername, password: guestPassword},{menu: menu}, {new:true});

    if(!!guestUser){
      result = {error: false, message: user}
      res.status(200).json(result);
    }else{
      res.status(400).json({error: true,  message: "Algo fue mal" });
    }    
  } catch (error) {
    res.status(400).json({error: true,  message: "Algo fue mal" });
  }

});


user.post('/pictures/:id', async(req, res) => {
  const data = req.body;
  const id = req.params.id;
  const picture = data.url;
  const dedicatoria = data.dedicatoria;

  try {
    //Hay que añadir la imagen tanto a users como a guest
    const userData = await User.find({_id:id});

    if(userData.length > 0){//la imagen la esta subiendo un admin
      const guestName = userData[0].guestsName;
      const guestPassword = userData[0].guestsPassword;

      const imagesUser = userData[0].images;

      const imagesUpdated = [...imagesUser, {url: picture, dedicatoria: dedicatoria}];


      let user = await User.findOneAndUpdate({_id: id}, {images: imagesUpdated},{new:true});

      const guestData = await GuestUser.find({userName: guestName, password: guestPassword});

      const guestId = guestData[0]._id;
      const guestImages = guestData[0].images;
      const guestImagesUpdated = [...guestImages, {url: picture, dedicatoria: dedicatoria}];

      let guest = await GuestUser.findOneAndUpdate({_id: guestId}, {images: guestImagesUpdated}, {new: true});

      if(!!user && !!guest){
        res.status(200).json({error: false, message: "Todo correcto"});
      }else{
        res.status(400).json({error: false, message: "Ocurrio un problema"});
      }
    }else{
      //la imagen la esta subiendo un guest
      const guestData = await GuestUser.find({_id: id});
      const adminId = guestData[0].idAdmin.toString();

      const guestImages = guestData[0].images;
      const guestImagesUpdated = [...guestImages, {url: picture, dedicatoria: dedicatoria}];
      const resultGuest = await GuestUser.findOneAndUpdate({_id: id}, {images: guestImagesUpdated}, {new: true});

      const adminData = await User.find({_id: adminId});

      const adminImages = adminData[0].images;
      const adminImagesUpdated = [...adminImages, {url: picture, dedicatoria: dedicatoria}];
      const admin = await User.findOneAndUpdate({_id: adminId},{images: adminImagesUpdated}, {new:true});

      if(!!resultGuest && !!admin){
        res.status(200).json({error: false, message: "Todo correcto"});
      }else{
        res.status(400).json({error: false, message: "Ocurrio un problema"});
      }
    }
   
  } catch (error) {
    res.status(400).json({error: true,  message: "Algo fue mal" });
  }
});

user.get('/pictures/:id', async(req, res) => {
  const id = req.params.id;

  try {
    const admin = await User.find({_id: id});

    if(admin.length > 0){
      const images = admin[0].images;
      res.status(200).json({error: false, message: images});
    }else{
      const guest = await GuestUser.find({_id: id});
      const images = guest[0].images;
      res.status(200).json({error: false, message: images});
    }
  } catch (error) {
    res.status(400).json({error: true,  message: "Algo fue mal" });
  }
});

user.post('/locations/:id', async(req, res) => {
  const id = req.params.id;
  const data = req.body;
  const partyLocation = data.partyLocation;
  const churchLocation = data.churchLocation;

  try {
    const admin = await User.findOneAndUpdate({_id: id}, {partyLocation: partyLocation, churchLocation: churchLocation}, {new:true});

    if(!!admin){
      const userName = admin.guestsName;
      const password = admin.guestsPassword;

      const guest = await GuestUser.findOneAndUpdate({userName: userName, password: password}, {partyLocation: partyLocation, churchLocation: churchLocation}, {new:true});

      if(!!guest){
        res.status(200).json({error: false, message:admin})
      }      
    }
  } catch (error) {
    res.status(400).json({error: true, message:"Algo malo ocurrio"})
  }
});

user.get('/locations/:id', async(req, res) => {
  const id = req.params.id;

  const user = await User.find({_id: id});
  if(user.length > 0){
    const locations = {
      partyLocation: user[0].partyLocation,
      churchLocation: user[0].churchLocation
    }

    res.status(200).json({error: false, message: locations})
  }else{
    const guest = await GuestUser.find({_id: id});
    if(guest.length > 0){
      const locations = {
        partyLocation: guest[0].partyLocation,
        churchLocation: guest[0].churchLocation
      }
  
      res.status(200).json({error: false, message: locations})
    }else{
      res.status(400).json({error: true, message:"Algo salio mal"})
    }
  }
})

user.post('/register', async(req, res) => {
  const data = req.body;

  const adminUserName = data.coupleUserName;
  const adminPassword = data.couplePassword;
  const guestsUserName = data.guestsUserName;
  const guestsPassword = data.guestsPassword;
  const adminEmail = data.coupleEmail;
  //Primero hay que comprobar si existen otros usuarios con ese nombre de admin
  //Ahora si existen invitados con ese nombre de invitados
  //Si no existen en ambos casos se crean los dos tipos de usuarios
  const existsUser = await User.find({userName: adminUserName, password: adminPassword});

  if(existsUser.length == 0){
    const guestUser = await GuestUser.find({userName: guestsUserName, password: guestsPassword});
    if(guestUser.length == 0){
      const newAdmin = await User.create({
        userName: adminUserName,
        password: adminPassword,
        email: adminEmail,
        guestsName: guestsUserName,
        guestsPassword: guestsPassword
      });

      const newGuest = await GuestUser.create({
        userName: guestsUserName,
        password: guestsPassword,
        idAdmin: newAdmin._id
      });

      if(!!newAdmin && !!newGuest){
        res.status(200).json({error: false, message: newAdmin})
      }else{
        res.status(400).json({error: true, message: "error"})
      }
    }else{
      res.status(400).json({error: true, message: "error"})
    }
  }else{
    res.status(400).json({error: true, message: "error"})
  }
})

export default user;