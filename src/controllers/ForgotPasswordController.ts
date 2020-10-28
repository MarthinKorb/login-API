import { Request, Response } from 'express';
import User from '../models/User';
import { getRepository } from 'typeorm';

import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { hash } from 'bcryptjs';

export default {
    async sendMail(request: Request, response: Response) {
        try {
            const { email } = request.body;

            const usersRepository = getRepository(User);

            const user = await usersRepository.findOne({
                where: { email },
            });

            if (!user) {
                return response
                    .status(404)
                    .json({ message: 'User not found ' });
            }

            var transport = nodemailer.createTransport({
                host: 'smtp.mailtrap.io',
                port: 2525,
                auth: {
                    user: '3d731a9f8b67ca',
                    pass: 'd08ff4996eb0f5',
                },
            });

            const newPassword = crypto.randomBytes(4).toString('hex');

            await transport
                .sendMail({
                    from: '<ec7cb522fd-3e452b@inbox.mailtrap.io>',
                    to: email,
                    subject: 'Recuperação de senha',
                    html: `<p>Olá ${user?.name}, sua nova senha para acessar o sistema é ${newPassword}</p></br>
                        <a href="http://localhost:3000/login">Logar</a>
                    `,
                })
                .then(async () => {
                    const newPasswordHashed = await hash(newPassword, 8);
                    await usersRepository.update(user?.id, {
                        password: newPasswordHashed,
                    });
                    return response.status(200).json({ message: 'Email sent' });
                })
                .catch(() => {
                    return response
                        .status(404)
                        .json({ error: 'user not found' });
                });
        } catch (err) {
            return response.status(400).json({ error: err.message });
        }
    },
};
