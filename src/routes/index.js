import { Router } from "express";
import {UserRepository} from "../repositories/user-repository.js";
import jwt from "jsonwebtoken"



import { SECRET_WORD } from "../config.js";

const router= Router();
router.get('/',(req,res)=>{
    res.render('index.ejs');
}

)

router.post('/login', async (req,res)=>{
    const {username,password}=req.body;
    try {
        const user = await UserRepository.login({ username, password });
    
        const token = jwt.sign(
            { id: user._id, username: user.username },
            SECRET_WORD,
            { expiresIn: '1h' }
        );
    
        res
            .cookie('access_token', token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 
            })
            .status(200)
            .send({ user, token });
    
    } catch (error) {
        console.error('Login error:', error);
        return res.status(400).send({ error: error.message });
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
    const token=req.cookies.access_token
    if(!token){
       return res.status(403).send("Accces no Authorized") 
    }
    try{
        const data= jwt.verify(token,SECRET_WORD)
        res.render("protected",data)
    } catch(error){
        res.status(401).send("Acces no Authorized")
    }
    
})


export default router;