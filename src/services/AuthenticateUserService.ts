import { getRepository } from 'typeorm';

import User from '../models/User';

import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import * as Yup from 'yup';
import auth from '../config/auth';

interface RequestDTO {
    email: string;
    password: string;
}

interface ResponseDTO {
    user: User;
    token: string;
}

export default class AuthenticateUserService {
    public async execute({
        email,
        password,
    }: RequestDTO): Promise<ResponseDTO> {
        const schema = Yup.object().shape({
            email: Yup.string().required(),
            password: Yup.string().required(),
        });

        await schema.validate(
            { email, password },
            {
                abortEarly: false,
            },
        );

        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne({ where: { email } });

        if (!user) {
            throw new Error('Incorrect Email/Password combination');
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new Error('Incorrect Email/Password combination');
        }

        const token = sign({}, auth.jwt.secret, {
            subject: user.id,
            expiresIn: auth.jwt.expiresIn,
        });

        return {
            user,
            token,
        };
    }
}
