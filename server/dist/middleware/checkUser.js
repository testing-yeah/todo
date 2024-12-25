"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const validateUser = (req, res, next) => {
    if (req.cookies.accessToken) {
        return next();
    }
    else {
        res.status(401).send('Unauthorized');
    }
};
exports.validateUser = validateUser;
