import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors';
import user from "./Services/Users.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'UPDATE']
}));

app.use(express.json());

//Mongoose connection

mongoose.connect('mongodb+srv://juancarlos:weddingPLANNER@cluster0.3g6kdhw.mongodb.net/bodafy?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MONGODB CONNECTED SUCCESSFULLY");

  if(mongoose.connection.readyState !== 1){
    console.log("NO SE PUDO CONECTAR CON LA BASE DE DATOS");
  }else{
    console.log("STATE: ", mongoose.connection.readyState);
  }
}).catch(err => {
  console.log("ERROR CONECTANDO A MONGODB: ", err.message);
})

export const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Routes
app.use('/user',user);

// Start Server
const server = app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

server.keepAliveTimeout = 120 * 1000; // 120 segundos
server.headersTimeout = 120 * 1000; // 120 segundos