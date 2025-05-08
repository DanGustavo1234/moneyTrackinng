import { Router } from "express";
import {UserRepository} from "../repositories/user-repository.js";

const router= Router();
router.get('/',(req,res)=>{
    res.render('example.ejs',{name:"Daniel",age: 23});
}



)

router.post('/login', async (req,res)=>{
    const {username,password}=req.body;
    try{
        const user= await UserRepository.login({username,password});
        return res.status(200).json(user);
    }catch(error){
        return res.status(400).send(error.message);
    }
})
router.post('/register', async (req,res)=>{
    const {username,password}=req.body;
    console.log(username,password);
    try{
        const user= await UserRepository.create({username,password});
        return res.status(201).json(user);
    }catch(error){
        return res.status(400).send(error.message);
    }
    
})
router.post('/logout',(req,res)=>{
    res.send(`<h1>Logout</h1>`);
})
router.get('/protected',(req,res)=>{
    res.send(`<h1>Protected</h1>`);
})


export default router;