import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

//Login Route:
router.post('/login', async(req, res)=>{
    const { email,password } = req.body;
    if(!email || !password)
        return res.status(400).json({ message:'All fields are required!!!' });

    try{
        const user = await User.findOne({ email });
        if(!user || !(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ message:'Invalid Email or Password!!!' });

        const token = jwt.sign({ id:user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '2h',
        });

        res.status(200).json({
            message: 'Login Successful!!!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    }catch(err){
        console.error('Login Error:',err);
        res.status(500).json({ message: 'Server Error!!!' });
    }
});

//Registration Route:
router.post('/register', async(req,res) => {
    const { name,email, password } = req.body;
    if(!name || !email || !password)
        return res.status(400).json({ message: 'All fields are required!!!' });

    try{
        const existingUser = await User.findOne({ email });
        if(existingUser)
            return res.status(409).json({ message: "The User's email id already exists!!!" });

        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPass });
        await newUser.save();

        res.status(201).json({ message:'User Registered Successfully, Welcome to VisEx !!!' });
    }catch(err){
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server Error!!!' });
    }
});

//Dashboard Route:
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'Welcome to the dashboard!', user });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;