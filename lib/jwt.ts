import jwt from 'jsonwebtoken'

const jwt_secret = process.env.SECRET as string;

export function signJwt(payload: Object){
    return jwt.sign(payload, jwt_secret);
}