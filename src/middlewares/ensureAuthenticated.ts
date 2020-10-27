import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';

interface TokenPayload {
    sub: string;
    iat: number;
    exp: number;
}

export default function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction,
): any {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return response.status(401).json({ message: 'JWT token is missing.' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, authConfig.jwt.secret);

        const { sub } = decoded as TokenPayload;

        request.user = {
            id: sub,
        };

        return next();
    } catch {
        return response.status(401).json({ message: 'Invalid JWT token' });
    }
}
