declare namespace Express {
    export interface Request {
        user: {
            id: string;
        };
    }
}
// Sobrescrevendo a tipagem do Express
