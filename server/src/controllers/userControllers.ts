import { createUser, getUser, loginUser } from '../services/userServices';
import { generateAccessToken, getAccessTokenPayload, getRefreshTokenPayload } from '../utils/tokenUtils';

type SignupData = {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
};
export async function logout(req: any, res: any) {
    res.clearCookie('refreshToken')
    res.clearCookie('accessToken')
    res.json({ message: 'Logged out successfully' });

}
export async function getUserData(req: any, res: any) {
    const user_id = req.body.user_id
    const user = await getUser(user_id as string)
    res.status(200).json(user)
}
export async function login(req: any, res: any) {
    try {
        const { emailOrUsername, password } = req.body
        const user = await loginUser({ emailOrUsername, password })
        res.cookie('accessToken', user.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1 * 60 * 60 * 1000 // 2 hours
        });

        res.cookie('refreshToken', user.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json(error)
    }
}
export async function signup(req: any, res: any) {
    try {
        const userData = req.body
        const user = await createUser(userData)
        res.cookie('accessToken', user.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1 * 60 * 60 * 1000 // 2 hours
        });

        res.cookie('refreshToken', user.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json(user)
    } catch (error) {
        res.status(404).json(error)
    }
}
export async function validateUserController(req: any, res: any) {
    try {
        if (req.cookies.refreshToken) {
            if (req.cookies.accessToken) {
                const userId = getAccessTokenPayload(req.cookies.accessToken);
                try {
                    const user = await getUser(userId as string);
                    return res.status(200).json({ ...user, isAuthenticated: true });
                }
                catch (error) {
                    console.error(error)
                }
            } else {
                const userId = getRefreshTokenPayload(req.cookies.refreshToken);
                res.cookie("accessToken", generateAccessToken(userId), {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 1 * 60 * 60 * 1000,
                });
                const user = await getUser(userId);
                return res.status(200).json({ ...user, isAuthenticated: true });
            }
        } else {
            return res.status(200).json({ isAuthenticated: false });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}