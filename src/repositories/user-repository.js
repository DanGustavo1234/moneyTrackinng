import dbLocal from "db-local";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../config.js";


const {Schema}= new dbLocal({path: "./db"});


const User=Schema("User",{
    _id:{type: String,required: true},
    username: {type: String, unique: true},
    password: {type: String, required: true},
})


export class UserRepository {
  static async create ({username, password}) {

    Validation.username(username);
    Validation.password(password);

    // Verificar si el Usuario existe
    const userExists= User.findOne({username});
    if(userExists) throw new Error("User already exists");
    // Crear el usuario
    const id= crypto.randomUUID();

    // Encriptar la contraseña
    const hashedPassword= await bcrypt.hash(password, SALT_ROUNDS);
    User.create(
      {
        _id: id,
        username,
        password:hashedPassword
      }
    ).save();
    return id
  }
  static async login ({username, password}) {
    Validation.username(username);
    Validation.password(password);
    // Verificar si el Usuario existe
    const userExists= User.findOne({username});
    if(!userExists) throw new Error("User does not exist");
    // Verificar la contraseña
    const isValid= await  bcrypt.compareSync(password, userExists.password);
    if(!isValid) throw new Error("Invalid password");
    // Retornar el usuario
    const {password:_,...user}= userExists;

    return user;
  }
}

class Validation{
  // Validaciones de username 
  static username(username){
    if(typeof username !== "string") throw new Error("Username must be a string");
    if(username.length < 3) throw new Error("Username must be at least 3 characters long");
  } 
   static password(password){
    if(typeof password !== "string") throw new Error("Password must be a string");
    if(password.length < 6) throw new Error("Password must be at least 6 characters long");
  }
}

