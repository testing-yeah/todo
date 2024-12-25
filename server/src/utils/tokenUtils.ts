import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: String) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

export const generateRefreshToken = (userId: String) => {
    return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string) => {
    const istokenValid = jwt.verify(token, process.env.JWT_SECRET as string)
    return { istokenValid, token };
};

export const verifyRefreshToken = (token: string) => {
    const istokenValid = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
    return { istokenValid, token };
};

export const getAccessTokenPayload = (token: string) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    return decoded.id
}
export const getRefreshTokenPayload = (token: string) => {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as jwt.JwtPayload;
    return decoded.id
}