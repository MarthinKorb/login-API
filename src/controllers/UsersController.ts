import { Request, Response } from "express";
import { getRepository } from "typeorm";

import User from "../models/User";

import CreateUserService from "../services/CreateUserSevice";

import * as Yup from "yup";
import { hash } from "bcryptjs";

export default {
  async index(request: Request, response: Response) {
    const usersRepository = getRepository(User);

    const users = await usersRepository.find();

    users.map((user) => delete user.password);

    return response.status(200).json(users);
  },

  async create(request: Request, response: Response) {
    try {
      const { name, email, password } = request.body;

      const createUser = new CreateUserService();

      const user = await createUser.execute({
        name,
        email,
        password,
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
      }
    );

    const usersRepository = getRepository(User);

    const userToUpdate = await usersRepository.findOne(id);

    if (!userToUpdate) {
      throw new Error();
    }

    const data = userToUpdate as User;

    const hashedPassword = await hash(password, 8);

    await usersRepository.update(data, {
      name,
      email,
      password: hashedPassword,
    });

    // await usersRepository.save({ name, email, password: hashedPassword });

    return response.status(200).json({ id, name, email, hashedPassword });
  },

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const usersRepository = getRepository(User);

    const userToBeDelected = await usersRepository.findOne(id);

    if (!userToBeDelected) {
      return response.status(404).json({ message: "user could not be found." });
    }

    usersRepository.delete(id);

    return response.status(200).json({ message: "User deleted." });
  },
};
