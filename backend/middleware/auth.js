import jwt from 'jsonwebtoken';

export function verifyToken (req,res,next){
    const authHeader = req.headers['authorization'];
    console.log('Incoming auth Header: ', authHeader);

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('No token found');
        return res.status(401).json({ message:'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        if(err){
            console.log('Invalid Token: ', err.message);
            return res.status(403).json({ message:'Invalid or expired token' });
        }

        req.user = decoded;
        console.log('Token Verified', decoded);
        next();
    });
};