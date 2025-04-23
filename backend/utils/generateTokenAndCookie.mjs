import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = async (user_id, res) => {
    const token = await jwt.sign({ user_id }, process.env.JWT, {
        expiresIn: '15d'
    });
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httponly: true
    });
}