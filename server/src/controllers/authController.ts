import { Request,Response } from "express";
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { getAvatarByGender } from "../utils/avatar";
import { generateToken } from "../utils/token";


//?---------------------------------------------------------------------------------------

//! name: register
//! function: REgisters user
//! uses: generatetoken and getavatar 

export const register = async(req:Request, res:Response):Promise<any> =>{
    const {email, username, password, gender} = req.body;


    try {
        const existingUser = await User.findOne({where: {email}});
        if(existingUser) return res.status(400).json({msg: 'Email already exists'});

        const hashedPassword = await bcrypt.hash(password, 10);

        const avatar = getAvatarByGender(gender);

        const user = await User.create({
            email,
            username,
            password:hashedPassword,
            gender,
            avatar,
        })

        const token = generateToken(user.id);
        res.status(201).json({user,token});
    } catch (err) {

        res.status(500).json({msg: 'Registration failed', error: err})
        
    }
}


//?-----------------------------------------------------------------------------------

//!name: login
//! descriptions: logsin user

export const login = async(req:  Request, res: Response):Promise<any> =>{
    const {email, password} = req.body;

    try {
        
        const user = await User.findOne({where: {email}});
        if(!user) return res.status(400).json({msg: 'Invalid credentials'});

        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(400).json({msg: 'Invalid credentials'});

        const token = generateToken(user.id);
        

        res.status(200).json({user, token});


    } catch (err) {
        res.status(500).json({msg: 'Login failed', error: err});

    }
};