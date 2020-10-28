import { getRepository } from 'typeorm';

import { hash } from 'bcryptjs';

import * as Yup from 'yup';

import User from '../models/User';

interface RequestDTO {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export default class CreateUserService {
    public async execute({
        name,
        email,
        password,
        passwordConfirmation,
    }: RequestDTO): Promise<User> {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().required(),
            password: Yup.string().required(),
            passwordConfirmation: Yup.string().required(),
        });

        await schema.validate(
            { name, email, password, passwordConfirmation },
            {
                abortEarly: false,
            },
        );

        const usersRepository = getRepository(User);

        const checkUserExists = await usersRepository.findOne({
            where: { email },
        });

        if (password !== passwordConfirmation) {
            throw Error('Password and password confirmation does not match');
        }

        const hashedPassword = await hash(password, 8);

        if (checkUserExists) {
            throw new Error('Email address already in use.');
        }

        const user = usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        await usersRepository.save(user);

        return user;
    }
}
