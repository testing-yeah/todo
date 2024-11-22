import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

// Middleware to check session validity
const checkSession = async (req, res, next) => {
    try {
        const sessionToken = req.cookies.sessionId;

        if (!sessionToken) {
            return res.status(401).json({ message: 'No session found' });
        }

        const user = await prisma.user.findUnique({
            where: { sessionToken },
        });

        if (!user || !user.expiresAt || new Date(user.expiresAt) < new Date()) {
            return res.status(401).json({ message: 'Session expired' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Session validation error:', error);
        return res.status(500).json({ message: 'Server error during session validation' });
    }
};

export default checkSession;
