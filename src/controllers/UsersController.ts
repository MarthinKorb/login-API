import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import User from '../models/User';

import CreateUserService from '../services/CreateUserService';
import UpdateUserService from '../services/UpdateUserService';
import DeleteUserService from '../services/DeleteUserService';

import * as Yup from 'yup';

export default {
    async index(request: Request, response: Response) {
        const usersRepository = getRepository(User);

        const users = await usersRepository.find();

        users.map(user => delete user.password);

        return response.status(200).json(users);
    },

    async create(request: Request, response: Response) {
        try {
            const {
                name,
                email,
                password,
                passwordConfirmation,
            } = request.body;

            const createUser = new CreateUserService();

            const user = await createUser.execute({
                name,
                email,
                password,
                passwordConfirmation,
            });

            delete user.password;

            return response.status(201).json(user);
        } catch (err) {
            return response.status(400).json({ error: err.message });
        }
    },

    async edit(request: Request, response: Response): Promise<any> {
        const { id } = request.params;

        const { name, email, password } = request.body;

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().required().max(300),
            password: Yup.string().required(),
        });

        await schema.validate(
            { name, email, password },
            {
                abortEarly: false,
            },
        );

        const updateUser = new UpdateUserService();

        await updateUser.execute({
            id,
            name,
            email,
            password,
        });

        return response.status(200).json({ message: 'User updated!' });
    },

    async delete(request: Request, response: Response) {
        try {
            const { id } = request.params;

            const deleteUser = new DeleteUserService();

            let userDeleted = await deleteUser.execute({ id });

            if (!userDeleted) {
                userDeleted = { message: 'user not found' };
                return response.status(404).json({ message: 'User not found' });
            } else {
                delete userDeleted.password;
                return response.status(200).json({ message: 'User deleted' });
            }
        } catch (err) {
            throw new Error('internal server error');
        }
    },
};
