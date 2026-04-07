import { Request, Response } from "express";
import { UserService } from "../../services/users";
import { UpdateUserDto } from "../../validation/users";

const userService = new UserService();

type Params = {
  id: string;
};

export class UserController {
  async getAll(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (e) {
      res.status(500).json({ message: "Error fetching users" });
    }
  }

  async getById(req: Request<Params>, res: Response) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json(user);
    } catch (e: any) {
      if (e.message === "USER_NOT_FOUND") {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(500).json({ message: "Error" });
    }
  }

  async update(req: Request<Params, {}, UpdateUserDto>, res: Response) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (e) {
      res.status(500).json({ message: "Error updating user" });
    }
  }

  async delete(req: Request<Params>, res: Response) {
    try {
      const result = await userService.deleteUser(req.params.id);
      res.json(result);
    } catch (e) {
      res.status(500).json({ message: "Error deleting user" });
    }
  }
}
