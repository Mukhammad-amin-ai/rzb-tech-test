import { AppDataSource } from "../../data-source";
import { User } from "../../entities/users";

export class UserService {
  private userRepo = AppDataSource.getRepository(User);

  async getAllUsers() {
    return this.userRepo.find({
      relations: ["books"],
    });
  }

  async getUserById(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ["books"],
    });

    if (!user) throw new Error("USER_NOT_FOUND");

    return user;
  }

  async updateUser(id: string, data: Partial<User>) {
    const user = await this.getUserById(id);

    Object.assign(user, data);

    return this.userRepo.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id);

    await this.userRepo.remove(user);

    return { message: "User deleted" };
  }
}
