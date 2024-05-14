import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secretKey = process.env.SECRET_KEY;

export function createToken(payload: object): string {
    if (!secretKey) {
        throw new Error('Secret key not found');
    }
    const token = jwt.sign(payload, secretKey, {
        expiresIn: '7d',
    });
    return token;
}

function verifyToken(token: string): any | null {
    if (!secretKey) {
        throw new Error('Token not found');
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (err) {
        console.error('Invalid token');
        return null;
    }
}
export const validateToken = (req: any, res: any, next: any) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }
    const bearerToken = token.split(' ')[1] || token;
    const decoded = verifyToken(bearerToken);
    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    req.user = decoded;
    next();
};
