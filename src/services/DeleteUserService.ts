import { response } from 'express';
import { getRepository } from 'typeorm';

import User from '../models/User';

interface RequestDTO {
    id: string;
}

export default class DeleteUserService {
    public async execute({ id }: RequestDTO): Promise<any> {
        try {
            const usersRepository = getRepository(User);

            const userToBeDelected = await usersRepository.findOne({
                where: { id },
            });

            if (!userToBeDelected) {
                throw new Error('User could not be found.');
            }

            await usersRepository.remove(userToBeDelected);

            return userToBeDelected;
        } catch (err) {
            console.log(err);
        }
    }
}
