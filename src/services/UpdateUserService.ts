import { getRepository } from 'typeorm';

import { hash } from 'bcryptjs';

import * as Yup from 'yup';

import User from '../models/User';

interface RequestDTO {
    id: string;
    name: string;
    email: string;
    password: string;
}

export default class UpdateUserService {
    public async execute({
        id,
        name,
        email,
        password,
    }: RequestDTO): Promise<User> {
        const usersRepository = getRepository(User);

        const userToUpdate = await usersRepository.findOne({
            where: { id },
        });

        if (!userToUpdate) {
            throw new Error('User not Found');
        }

        const userWIthUpdatedEmail = await usersRepository.findOne({
            where: { email },
        });

        if (userWIthUpdatedEmail && userWIthUpdatedEmail.id !== id) {
            throw new Error('E-mail already in use.');
        }

        userToUpdate.name = name;
        userToUpdate.email = email;
        userToUpdate.password = await hash(password, 8);

        return await usersRepository.save(userToUpdate);
    }
}
