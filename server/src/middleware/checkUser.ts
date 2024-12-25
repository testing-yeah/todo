export const validateUser = (req: any, res: any, next: any) => {
    if (req.cookies.accessToken) {
        return next()
    }
    else {
        res.status(401).send('Unauthorized');
    }
}