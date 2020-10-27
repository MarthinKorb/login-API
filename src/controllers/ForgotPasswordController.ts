import { Request, Response } from 'express';

import ForgotPasswordService from '../services/ForgotPasswordService';

export default {
    async sendMail(request: Request, response: Response) {
        try {
            const { email } = request.body;

            const forgotPassword = new ForgotPasswordService();

            await forgotPassword.execute({ email });

            return response
                .status(200)
                .json({ message: 'Email sent successfully!' });
        } catch (err) {
            return response.status(400).json({ error: err.message });
        }
    },
};
