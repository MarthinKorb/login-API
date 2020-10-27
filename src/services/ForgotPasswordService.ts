import { getRepository } from 'typeorm';

import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { hash } from 'bcryptjs';

import User from '../models/User';
import { response } from 'express';

interface RequestDTO {
    email: string;
}

export default class ForgotPasswordService {
    public async execute({ email }: RequestDTO): Promise<any> {
        try {
            const usersRepository = getRepository(User);

            const user = await usersRepository.findOne({
                where: { email },
            });

            var transport = nodemailer.createTransport({
                host: 'smtp.mailtrap.io',
                port: 2525,
                auth: {
                    user: '3d731a9f8b67ca',
                    pass: 'd08ff4996eb0f5',
                },
            });

            const newPassword = crypto.randomBytes(4).toString('hex');

            transport
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
                    return response
                        .status(200)
                        .json({ message: 'Email sent!' });
                })
                .catch(() => {
                    response.status(404).json({ message: 'User not found' });
                });
        } catch (err) {
            throw new Error(err);
        }
    }
}
