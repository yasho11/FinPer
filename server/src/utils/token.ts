import jwt from 'jsonwebtoken';

export const generateToken = (id:number): string => {
    return jwt.sign({id}, process.env.JWT_SECRET!,{expiresIn: '7d'});
}

export const verifyToken = (token: string): number => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    return decoded.id;
};